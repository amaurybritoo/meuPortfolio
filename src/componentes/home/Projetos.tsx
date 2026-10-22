import { useEffect, useMemo, useRef, useState } from "react";
import { usePortfolio } from "../../contexto/usePortfolio";
import { FaCheckCircle, FaChevronRight, FaThumbsUp } from "react-icons/fa";
import { idsEmConjuntos } from "../../utilitarios/conjuntos";
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
  const trilhoRef = useRef<HTMLDivElement>(null);
  const marcadorRef = useRef<HTMLSpanElement>(null);
  const [carrosselAtivo, setCarrosselAtivo] = useState(false);
  const [carrosselFinal, setCarrosselFinal] = useState(false);

  const emConjuntos = idsEmConjuntos(projetos);
  const visiveis = projetos.filter((p) => !emConjuntos.has(p.id));
  const categorias = useMemo(() => Array.from(new Set(visiveis.map((p) => p.categoria).filter(Boolean))), [visiveis]);
  const filtroAtual = categorias.includes(filtro) ? filtro : TODOS;
  // filter preserva a ordem original de dados.projetos; não ordenar por destaque, nome ou ano.
  const lista = filtroAtual === TODOS ? visiveis : visiveis.filter((p) => p.categoria === filtroAtual);
  const chaveOrdemLista = lista.map((p) => p.id).join("|");

  // Ao trocar o filtro ou reordenar/adicionar projetos, a lista começa sempre pelo primeiro card.
  useEffect(() => {
    if (gradeRef.current) gradeRef.current.scrollTo({ left: 0, behavior: "auto" });
  }, [filtroAtual, chaveOrdemLista]);

  useEffect(() => {
    const grade = gradeRef.current;
    if (!grade) return;
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const maximo = grade.scrollWidth - grade.clientWidth;
      const ativo = window.matchMedia("(max-width: 700px)").matches && maximo > 2;
      const percentual = maximo > 0 ? (grade.scrollLeft / maximo) * 100 : 0;
      const final = ativo && percentual >= 98;
      const largura = ativo ? Math.min(100, (grade.clientWidth / grade.scrollWidth) * 100) : 100;
      const esquerda = ativo && maximo > 0 ? (grade.scrollLeft / maximo) * (100 - largura) : 0;
      if (marcadorRef.current) {
        marcadorRef.current.style.width = `${largura}%`;
        marcadorRef.current.style.left = `${esquerda}%`;
      }
      trilhoRef.current?.setAttribute("aria-valuenow", String(Math.round(percentual)));
      setCarrosselAtivo((anterior) => anterior === ativo ? anterior : ativo);
      setCarrosselFinal((anterior) => anterior === final ? anterior : final);
    };
    const atualizar = () => {
      if (quadro) return;
      quadro = window.requestAnimationFrame(calcular);
    };
    atualizar();
    grade.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    const observador = typeof ResizeObserver !== "undefined" ? new ResizeObserver(atualizar) : null;
    observador?.observe(grade);
    return () => {
      if (quadro) window.cancelAnimationFrame(quadro);
      grade.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
      observador?.disconnect();
    };
  }, [filtroAtual, chaveOrdemLista]);

  if (!config.ativa || visiveis.length === 0) return null;

  return (
    <section id="projetos" className="secao" aria-labelledby="titulo-projetos">
      <div className="container">
        <Revelar>
          <CabecalhoSecao id="titulo-projetos" titulo={config.titulo} subtitulo={config.subtitulo} />
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
                <CardProjeto projeto={projeto} projetos={projetos} />
              </Revelar>
            </li>
          ))}
        </ul>
        <div className={`projetos-carrossel-indicador ${carrosselAtivo ? "ativo" : ""}`} aria-hidden={!carrosselAtivo}>
          <span className={`projetos-carrossel-instrucao ${carrosselFinal ? "final" : ""}`} aria-live="polite">
            {carrosselFinal ? <><FaCheckCircle aria-hidden="true" /> Você chegou ao último projeto</> : <><FaThumbsUp aria-hidden="true" /> Arraste para ver mais projetos <FaChevronRight aria-hidden="true" /></>}
          </span>
          <div className="projetos-carrossel-trilho" ref={trilhoRef} role="progressbar" aria-label="Posição no carrossel de projetos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <span ref={marcadorRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
