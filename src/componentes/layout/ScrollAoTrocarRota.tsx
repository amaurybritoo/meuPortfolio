import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Ao mudar de página volta ao topo; se o endereço tiver #secao, rola até ela. */
export default function ScrollAoTrocarRota() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Âncoras internas continuam funcionando, mas uma página aberta/atualizada
    // com um hash antigo começa no topo em vez de saltar direto para uma seção.
    if (hash && navigationType !== "POP") {
      const id = decodeURIComponent(hash.slice(1));
      // espera a página desenhar a seção antes de rolar
      const tentativa = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
      }, 60);
      return () => window.clearTimeout(tentativa);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, navigationType]);

  return null;
}
