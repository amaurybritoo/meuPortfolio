import { usePortfolio } from "../../contexto/usePortfolio";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Revelar from "../comuns/Revelar";
import "../../estilos/secoes.css";

export default function Experiencia() {
  const { dados } = usePortfolio();
  const formacao = dados.secoes.formacao;
  const exibirFormacao = formacao.ativa && dados.formacoes.length > 0;
  if (!exibirFormacao) return null;

  return (
    <section id="formacao" className="secao" aria-labelledby="titulo-formacao">
      <div className="container container-estreito">
        <Revelar>
          <CabecalhoSecao id="titulo-formacao" rotulo="04" titulo={formacao.titulo} subtitulo={formacao.subtitulo} />
        </Revelar>
        <ol className="linha-tempo">
          {dados.formacoes.map((item, i) => (
            <li key={item.id}><Revelar atraso={i * 80}><article className="linha-tempo-item">
              {item.periodo && <span className="linha-tempo-periodo">{item.periodo}</span>}
              <h3>{item.titulo}</h3>{item.local && <p className="linha-tempo-local">{item.local}</p>}
              {item.descricao && <p>{item.descricao}</p>}
            </article></Revelar></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
