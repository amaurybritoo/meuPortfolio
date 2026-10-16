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
      <div className="fundo-morcegos">
        {[1, 2, 3].map((numero) => (
          <svg key={numero} className={`fundo-morcego fundo-morcego-${numero}`} viewBox="0 0 96 48" focusable="false">
            <path className="morcego-asa morcego-asa-esquerda" d="M45 24C35 15 28 6 12 5c4 6 3 10 1 13-4-3-8-4-12-3 7 5 9 11 10 18 8-4 15-5 23-3l11-2Z" />
            <path className="morcego-asa morcego-asa-direita" d="M51 24C61 15 68 6 84 5c-4 6-3 10-1 13 4-3 8-4 12-3-7 5-9 11-10 18-8-4-15-5-23-3l-11-2Z" />
            <path className="morcego-corpo" d="M48 17c-5 0-8 5-8 11 0 7 4 13 8 17 4-4 8-10 8-17 0-6-3-11-8-11Z" />
            <path className="morcego-orelhas" d="m42 20-3-9 8 5m7 4 3-9-8 5" />
            <circle className="morcego-olho" cx="44" cy="24" r="1.2" />
            <circle className="morcego-olho" cx="52" cy="24" r="1.2" />
          </svg>
        ))}
      </div>
      <Suspense fallback={null}>
        <Dragao config={dados.aparencia.dragao} />
      </Suspense>
    </div>
  );
}
