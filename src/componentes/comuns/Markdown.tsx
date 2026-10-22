import { createElement } from "react";
import type { ReactNode } from "react";

const TAGS_HTML_SEGURO = new Set(["a", "b", "blockquote", "br", "code", "del", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6", "i", "li", "ol", "p", "pre", "s", "small", "span", "strong", "sub", "sup", "u", "ul"]);
const TAGS_HTML_PERIGOSO = new Set(["script", "style", "iframe", "object", "embed", "svg", "math"]);

function textoComHtmlSeguro(texto: string): ReactNode[] {
  if (!/<\/?[a-z][^>]*>/i.test(texto) || typeof DOMParser === "undefined") return MarkdownEmLinha({ texto });
  const documento = new DOMParser().parseFromString(texto, "text/html");
  const renderizar = (no: Node, chave: string): ReactNode => {
    if (no.nodeType === Node.TEXT_NODE) return <span key={chave}>{MarkdownEmLinha({ texto: no.textContent ?? "" })}</span>;
    if (no.nodeType !== Node.ELEMENT_NODE) return null;
    const elemento = no as Element;
    const tag = elemento.tagName.toLowerCase();
    if (TAGS_HTML_PERIGOSO.has(tag)) return null;
    const filhos = Array.from(elemento.childNodes).map((filho, indice) => renderizar(filho, `${chave}-${indice}`));
    if (!TAGS_HTML_SEGURO.has(tag)) return <span key={chave}>{filhos}</span>;
    if (tag === "a") {
      const href = elemento.getAttribute("href") ?? "";
      try {
        const url = new URL(href, window.location.origin);
        if (["http:", "https:", "mailto:"].includes(url.protocol)) {
          return createElement("a", { key: chave, href, target: url.protocol === "http:" || url.protocol === "https:" ? "_blank" : undefined, rel: "noopener noreferrer" }, ...filhos);
        }
      } catch { /* links inválidos viram apenas texto seguro */ }
      return <span key={chave}>{filhos}</span>;
    }
    return createElement(tag, { key: chave }, ...filhos);
  };
  return Array.from(documento.body.childNodes).map((no, indice) => renderizar(no, `html-${indice}`));
}

/** Renderiza Markdown e um subconjunto seguro de HTML; links só aceitam protocolos web seguros. */
export function MarkdownEmLinha({ texto }: { texto: string }): ReactNode[] {
  const partes = texto.split(/(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return partes.map((parte, i) => {
    if (parte.startsWith("**") || parte.startsWith("__")) return <strong key={i}>{parte.slice(2, -2)}</strong>;
    if ((parte.startsWith("*") && parte.endsWith("*")) || (parte.startsWith("_") && parte.endsWith("_"))) return <em key={i}>{parte.slice(1, -1)}</em>;
    if (parte.startsWith("~~")) return <del key={i}>{parte.slice(2, -2)}</del>;
    if (parte.startsWith("`")) return <code key={i}>{parte.slice(1, -1)}</code>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(parte);
    if (link) {
      try {
        const url = new URL(link[2], window.location.origin);
        if (["http:", "https:", "mailto:"].includes(url.protocol)) return <a key={i} href={link[2]} target={url.protocol === "http:" || url.protocol === "https:" ? "_blank" : undefined} rel="noopener noreferrer">{link[1]}</a>;
      } catch { /* URL inválida permanece como texto simples. */ }
    }
    return parte;
  });
}

export function Markdown({ texto, className }: { texto: string; className?: string }) {
  const linhas = texto.replace(/\r\n?/g, "\n").split("\n");
  const blocos: ReactNode[] = [];
  let paragrafo: string[] = [];
  let lista: string[] = [];
  const fecharParagrafo = () => { if (paragrafo.length) { blocos.push(<p key={`p-${blocos.length}`}>{paragrafo.map((l, i) => <span key={i}>{i > 0 && <br />}{textoComHtmlSeguro(l)}</span>)}</p>); paragrafo = []; } };
  const fecharLista = () => { if (lista.length) { blocos.push(<ul key={`ul-${blocos.length}`}>{lista.map((l, i) => <li key={i}>{MarkdownEmLinha({ texto: l })}</li>)}</ul>); lista = []; } };
  linhas.forEach((linha) => {
    if (/^\s*<(?:div|h[1-6]|ol|p|pre|ul|blockquote)\b/i.test(linha)) {
      fecharParagrafo();
      fecharLista();
      blocos.push(<div key={`html-${blocos.length}`}>{textoComHtmlSeguro(linha)}</div>);
      return;
    }
    const item = /^\s*[-*+]\s+(.+)$/.exec(linha);
    if (item) { fecharParagrafo(); lista.push(item[1]); return; }
    fecharLista();
    const titulo = /^(#{1,3})\s+(.+)$/.exec(linha);
    if (titulo) { fecharParagrafo(); const conteudo = MarkdownEmLinha({ texto: titulo[2] }); const n = titulo[1].length; blocos.push(n === 1 ? <h2 key={`h-${blocos.length}`}>{conteudo}</h2> : n === 2 ? <h3 key={`h-${blocos.length}`}>{conteudo}</h3> : <h4 key={`h-${blocos.length}`}>{conteudo}</h4>); return; }
    if (!linha.trim()) { fecharParagrafo(); return; }
    paragrafo.push(linha);
  });
  fecharLista(); fecharParagrafo();
  return <div className={className}>{blocos}</div>;
}
