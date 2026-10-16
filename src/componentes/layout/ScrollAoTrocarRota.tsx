import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Ao mudar de página volta ao topo; se o endereço tiver #secao, rola até ela. */
export default function ScrollAoTrocarRota() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const posicoes = useRef(new Map<string, number>());
  const chaveAtiva = useRef(key);

  useEffect(() => {
    const salvarPosicao = () => posicoes.current.set(chaveAtiva.current, window.scrollY);
    window.addEventListener("scroll", salvarPosicao, { passive: true });
    return () => window.removeEventListener("scroll", salvarPosicao);
  }, []);

  useEffect(() => {
    chaveAtiva.current = key;
    if (navigationType === "POP") {
      const posicao = posicoes.current.get(key) ?? 0;
      const quadro = window.requestAnimationFrame(() => window.scrollTo({ top: posicao, left: 0, behavior: "auto" }));
      return () => window.cancelAnimationFrame(quadro);
    }
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Âncoras internas continuam funcionando, mas uma página aberta/atualizada
    // com um hash antigo começa no topo em vez de saltar direto para uma seção.
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // espera a página desenhar a seção antes de rolar
      const tentativa = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
      }, 60);
      return () => window.clearTimeout(tentativa);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, navigationType, key]);

  return null;
}
