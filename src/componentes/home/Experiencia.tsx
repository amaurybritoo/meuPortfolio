import { usePortfolio } from "../../contexto/usePortfolio";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Revelar from "../comuns/Revelar";
import "../../estilos/secoes.css";

export default function Experiencia() {
  const { dados } = usePortfolio();
  const config = dados.secoes.experiencia;
  if (!config.ativa || dados.experiencias.length === 0) return null;

  return (
    <section id="experiencia" className="secao" aria-labelledby="titulo-experiencia">
      <div className="container container-estreito">
        <Revelar>
          <CabecalhoSecao id="titulo-experiencia" rotulo="04" titulo={config.titulo} subtitulo={config.subtitulo} />
        </Revelar>
        <ol className="linha-tempo">
          {dados.experiencias.map((item, i) => (
            <li key={item.id}>
              <Revelar atraso={i * 80}>
                <article className="linha-tempo-item">
                  {item.periodo && <span className="linha-tempo-periodo">{item.periodo}</span>}
                  <h3>{item.titulo}</h3>
                  {item.local && <p className="linha-tempo-local">{item.local}</p>}
                  {item.descricao && <p>{item.descricao}</p>}
                </article>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
