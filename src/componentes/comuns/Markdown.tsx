import type { ReactNode } from "react";

/** Renderiza Markdown simples sem interpretar HTML; links só aceitam protocolos web seguros. */
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
  const fecharParagrafo = () => { if (paragrafo.length) { blocos.push(<p key={`p-${blocos.length}`}>{paragrafo.map((l, i) => <span key={i}>{i > 0 && <br />}{MarkdownEmLinha({ texto: l })}</span>)}</p>); paragrafo = []; } };
  const fecharLista = () => { if (lista.length) { blocos.push(<ul key={`ul-${blocos.length}`}>{lista.map((l, i) => <li key={i}>{MarkdownEmLinha({ texto: l })}</li>)}</ul>); lista = []; } };
  linhas.forEach((linha) => {
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
