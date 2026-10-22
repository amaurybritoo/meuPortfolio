import { useEffect } from "react";

function definirMeta(seletor: string, atributo: "name" | "property", chave: string, conteudo: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(seletor);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(atributo, chave);
    document.head.appendChild(el);
  }
  el.setAttribute("content", conteudo);
}

/** Atualiza título da aba e descrição para compartilhamento. */
export function useSeo(titulo: string, descricao: string, imagem?: string): void {
  useEffect(() => {
    document.title = titulo;
    definirMeta('meta[name="description"]', "name", "description", descricao);
    definirMeta('meta[property="og:title"]', "property", "og:title", titulo);
    definirMeta('meta[property="og:description"]', "property", "og:description", descricao);
    if (imagem) definirMeta('meta[property="og:image"]', "property", "og:image", imagem);
  }, [titulo, descricao, imagem]);
}
