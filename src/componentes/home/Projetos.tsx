import { useMemo, useState } from "react";
import { usePortfolio } from "../../contexto/usePortfolio";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Revelar from "../comuns/Revelar";
import CardProjeto from "./CardProjeto";
import "../../estilos/projetos.css";

const TODOS = "todos";

export default function Projetos() {
  const { dados, projetos } = usePortfolio();
  const config = dados.secoes.projetos;
  const [filtro, setFiltro] = useState(TODOS);

  const visiveis = projetos;
  const categorias = useMemo(() => Array.from(new Set(visiveis.map((p) => p.categoria).filter(Boolean))), [visiveis]);
  const filtroAtual = categorias.includes(filtro) ? filtro : TODOS;
  const lista = filtroAtual === TODOS ? visiveis : visiveis.filter((p) => p.categoria === filtroAtual);

  if (!config.ativa || visiveis.length === 0) return null;

  return (
    <section id="projetos" className="secao" aria-labelledby="titulo-projetos">
      <div className="container">
        <Revelar>
          <CabecalhoSecao id="titulo-projetos" rotulo="03" titulo={config.titulo} subtitulo={config.subtitulo} />
        </Revelar>

        {categorias.length > 1 && (
          <div className="filtros" role="group" aria-label="Filtrar projetos por categoria">
            {[TODOS, ...categorias].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filtro ${filtroAtual === cat ? "ativo" : ""}`}
                aria-pressed={filtroAtual === cat}
                onClick={() => setFiltro(cat)}
              >
                {cat === TODOS ? "Todos" : cat}
              </button>
            ))}
          </div>
        )}

        <ul className="projetos-grade">
          {lista.map((projeto, i) => (
            <li key={projeto.id}>
              <Revelar atraso={(i % 3) * 90}>
                <CardProjeto projeto={projeto} />
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
