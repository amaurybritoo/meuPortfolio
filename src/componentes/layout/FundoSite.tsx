import { lazy, Suspense } from "react";
import { usePortfolio } from "../../contexto/usePortfolio";
import "../../estilos/fundo.css";

// O desenho animado do dragão carrega em separado para liberar a primeira tela antes.
const Dragao = lazy(() => import("../dragao/Dragao"));

/** Camada fixa atrás de tudo: brilhos suaves + dragão voando. Nunca recebe cliques. */
export default function FundoSite() {
  const { dados } = usePortfolio();
  return (
    <div className="fundo-site" aria-hidden="true">
      <div className="fundo-brilho fundo-brilho-1" />
      <div className="fundo-brilho fundo-brilho-2" />
      <div className="fundo-grade" />
      <Suspense fallback={null}>
        <Dragao config={dados.aparencia.dragao} />
      </Suspense>
    </div>
  );
}
