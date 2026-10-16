import { usePortfolio } from "../../contexto/usePortfolio";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Icone from "../comuns/Icone";
import Revelar from "../comuns/Revelar";
import "../../estilos/secoes.css";

export default function Habilidades() {
  const { dados } = usePortfolio();
  const config = dados.secoes.habilidades;
  const grupos = dados.habilidades.filter((g) => g.itens.length > 0);
  if (!config.ativa || grupos.length === 0) return null;

  return (
    <section id="habilidades" className="secao" aria-labelledby="titulo-habilidades">
      <div className="container">
        <Revelar>
          <CabecalhoSecao id="titulo-habilidades" titulo={config.titulo} subtitulo={config.subtitulo} />
        </Revelar>
        <div className="habilidades-grade">
          {grupos.map((grupo, i) => (
            <Revelar key={grupo.id} atraso={i * 90}>
              <article className="habilidades-grupo">
                <h3>{grupo.titulo}</h3>
                <ul>
                  {grupo.itens.map((item) => (
                    <li key={item.id} className="chip chip-icone">
                      <Icone nome={item.icone} />
                      {item.nome}
                    </li>
                  ))}
                </ul>
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
