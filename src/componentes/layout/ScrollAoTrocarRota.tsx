import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Ao mudar de página volta ao topo; se o endereço tiver #secao, rola até ela. */
export default function ScrollAoTrocarRota() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // espera a página desenhar a seção antes de rolar
      const tentativa = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
      }, 60);
      return () => window.clearTimeout(tentativa);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
