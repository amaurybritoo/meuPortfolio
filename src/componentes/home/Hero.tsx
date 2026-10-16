import { useEffect, useState } from "react";
import { FaArrowRight, FaDownload } from "react-icons/fa";
import { usePortfolio } from "../../contexto/usePortfolio";
import Icone from "../comuns/Icone";
import { MarkdownEmLinha } from "../comuns/Markdown";
import LinkSecao from "../layout/LinkSecao";
import "../../estilos/hero.css";

/** Cargos que se revezam embaixo do nome (ex.: Front-end Developer / QA Engineer). */
function CargosAlternando({ cargos }: { cargos: string[] }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (cargos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndice((i) => (i + 1) % cargos.length), 2800);
    return () => window.clearInterval(timer);
  }, [cargos.length]);

  if (cargos.length === 0) return null;
  const atual = cargos[indice % cargos.length];
  return (
    <p className="hero-cargo" aria-label={cargos.join(" e ")}>
      <span key={atual} aria-hidden="true" className="hero-cargo-texto">{atual}</span>
    </p>
  );
}

export default function Hero() {
  const { dados, projetos } = usePortfolio();
  const { perfil, estatisticas, habilidades, secoes } = dados;
  const destaques = habilidades.slice(0, 3).map((g) => g.itens[0]).filter((h) => h !== undefined);
  const temProjetos = secoes.projetos.ativa && projetos.length > 0;

  return (
    <section className="hero" aria-labelledby="titulo-hero">
      <div className="container hero-grade">
        <div className="hero-texto">
          <p className="hero-ola">Olá, eu sou</p>
          <h1 id="titulo-hero">{perfil.nome}</h1>
          <CargosAlternando cargos={perfil.cargos} />
          {perfil.frase && <p className="hero-frase">{MarkdownEmLinha({ texto: perfil.frase })}</p>}

          <div className="hero-acoes">
            <div className="hero-acoes-principais">
              {temProjetos && (
                <LinkSecao id="projetos" className="botao botao-primario">
                  Ver projetos <FaArrowRight aria-hidden="true" />
                </LinkSecao>
              )}
              {secoes.contato.ativa && (
                <LinkSecao id="contato" className="botao botao-contorno">
                  Falar comigo
                </LinkSecao>
              )}
            </div>
            <a className="botao botao-contorno hero-curriculo" href="/curriculo?imprimir=1" target="_blank" rel="noopener noreferrer"><FaDownload aria-hidden="true" /> Exportar currículo em PDF</a>
          </div>

          {perfil.redes.length > 0 && (
            <ul className="hero-redes" aria-label="Redes sociais">
              {perfil.redes.map((rede) => (
                <li key={rede.id}>
                  <a href={rede.url} target="_blank" rel="noopener noreferrer" aria-label={rede.rotulo} title={rede.rotulo}>
                    <Icone nome={rede.icone} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hero-visual">
          <div className="hero-aura" aria-hidden="true" />
          {perfil.foto && <img className="hero-foto" src={perfil.foto} alt={`Foto de ${perfil.nome}`} width={520} height={560} fetchPriority="high" />}
          {destaques.map((h, i) => <span key={h.id} className={`hero-chip hero-chip-${i + 1}`} aria-hidden="true"><Icone nome={h.icone} /> {h.nome}</span>)}
        </div>
      </div>

      {estatisticas.length > 0 && (
        <div className="container">
          <ul className="hero-numeros">
            {estatisticas.map((e) => (
              <li key={e.id}>
                <strong>{e.valor}</strong>
                <span>{e.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
