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
    // Âncoras internas continuam funcionando, mas uma página aberta/atualizada
    // com um hash antigo começa no topo em vez de saltar direto para uma seção.
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let quadro = 0;
      let tempoLimite = 0;
      const rolarParaSecao = () => {
        const secao = document.getElementById(id);
        if (!secao) return false;
        quadro = window.requestAnimationFrame(() => {
          secao.scrollIntoView({ behavior: "auto", block: "start" });
        });
        return true;
      };

      // A página inicial e suas seções são carregadas sob demanda. Aguarda o
      // alvo existir para não deixar o usuário no topo ao voltar de um projeto.
      if (rolarParaSecao()) return () => window.cancelAnimationFrame(quadro);

      const observador = new MutationObserver(() => {
        if (rolarParaSecao()) {
          observador.disconnect();
          window.clearTimeout(tempoLimite);
        }
      });
      observador.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });
      tempoLimite = window.setTimeout(() => observador.disconnect(), 10000);
      return () => {
        observador.disconnect();
        window.clearTimeout(tempoLimite);
        window.cancelAnimationFrame(quadro);
      };
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, navigationType, key]);

  return null;
}
