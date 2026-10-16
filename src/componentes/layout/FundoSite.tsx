import { usePortfolio } from "../../contexto/usePortfolio";
import Dragao from "../dragao/Dragao";
import "../../estilos/fundo.css";

/** Camada fixa atrás de tudo: brilhos suaves + dragão voando. Nunca recebe cliques. */
export default function FundoSite() {
  const { dados } = usePortfolio();
  return (
    <div className="fundo-site" aria-hidden="true">
      <div className="fundo-brilho fundo-brilho-1" />
      <div className="fundo-brilho fundo-brilho-2" />
      <div className="fundo-grade" />
      <Dragao config={dados.aparencia.dragao} />
    </div>
  );
}
