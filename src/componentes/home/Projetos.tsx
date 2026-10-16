import { useEffect, useMemo, useRef, useState } from "react";
import { usePortfolio } from "../../contexto/usePortfolio";
import { FaCheckCircle, FaChevronRight, FaThumbsUp } from "react-icons/fa";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Revelar from "../comuns/Revelar";
import CardProjeto from "./CardProjeto";
import "../../estilos/projetos.css";

const TODOS = "todos";

export default function Projetos() {
  const { dados, projetos } = usePortfolio();
  const config = dados.secoes.projetos;
  const [filtro, setFiltro] = useState(TODOS);
  const gradeRef = useRef<HTMLUListElement>(null);
  const [carrossel, setCarrossel] = useState({ ativo: false, largura: 100, esquerda: 0, percentual: 0, final: false });

  const visiveis = projetos;
  const categorias = useMemo(() => Array.from(new Set(visiveis.map((p) => p.categoria).filter(Boolean))), [visiveis]);
  const filtroAtual = categorias.includes(filtro) ? filtro : TODOS;
  const lista = filtroAtual === TODOS ? visiveis : visiveis.filter((p) => p.categoria === filtroAtual);

  useEffect(() => {
    const grade = gradeRef.current;
    if (!grade) return;
    const atualizar = () => {
      const maximo = grade.scrollWidth - grade.clientWidth;
      const ativo = window.matchMedia("(max-width: 700px)").matches && maximo > 2;
      const largura = ativo ? Math.min(100, (grade.clientWidth / grade.scrollWidth) * 100) : 100;
      const percentual = maximo > 0 ? (grade.scrollLeft / maximo) * 100 : 0;
      const esquerda = ativo && maximo > 0 ? (grade.scrollLeft / maximo) * (100 - largura) : 0;
      const final = ativo && percentual >= 98;
      setCarrossel((anterior) => anterior.ativo === ativo && anterior.largura === largura && anterior.esquerda === esquerda && anterior.percentual === percentual && anterior.final === final
        ? anterior
        : { ativo, largura, esquerda, percentual, final });
    };
    atualizar();
    grade.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      grade.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, [filtroAtual, lista.length]);

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

        <ul className="projetos-grade" ref={gradeRef}>
          {lista.map((projeto, i) => (
            <li key={projeto.id}>
              <Revelar atraso={(i % 3) * 90}>
                <CardProjeto projeto={projeto} />
              </Revelar>
            </li>
          ))}
        </ul>
        <div className={`projetos-carrossel-indicador ${carrossel.ativo ? "ativo" : ""}`} aria-hidden={!carrossel.ativo}>
          <span className={`projetos-carrossel-instrucao ${carrossel.final ? "final" : ""}`} aria-live="polite">
            {carrossel.final ? <><FaCheckCircle aria-hidden="true" /> Você chegou ao último projeto</> : <><FaThumbsUp aria-hidden="true" /> Arraste para ver mais projetos <FaChevronRight aria-hidden="true" /></>}
          </span>
          <div className="projetos-carrossel-trilho" role="progressbar" aria-label="Posição no carrossel de projetos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(carrossel.percentual)}>
            <span style={{ width: `${carrossel.largura}%`, left: `${carrossel.esquerda}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
