import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaGithub, FaPlay, FaSearchPlus, FaVial } from "react-icons/fa";
import { usePortfolio } from "../contexto/usePortfolio";
import CabecalhoSecao from "../componentes/comuns/CabecalhoSecao";
import Revelar from "../componentes/comuns/Revelar";
import { useSeo } from "../componentes/comuns/useSeo";
import PaginaBase from "../componentes/layout/PaginaBase";
import GaleriaProjeto from "../componentes/projeto/GaleriaProjeto";
import Lightbox from "../componentes/projeto/Lightbox";
import type { Midia, Teste as TipoTeste } from "../tipos";
import { paragrafos } from "../utilitarios/texto";
import NaoEncontrado from "./NaoEncontrado";
import "../estilos/projeto.css";

export default function Projeto() {
  const { slug = "" } = useParams();
  const { dados, projetos: visiveis } = usePortfolio();
  const indice = visiveis.findIndex((p) => p.slug === slug);
  const projeto = indice >= 0 ? visiveis[indice] : undefined;
  useSeo(projeto ? `${projeto.nome} | ${dados.perfil.nome}` : `Projeto não encontrado | ${dados.perfil.nome}`, projeto?.resumo || dados.seo.descricao, projeto?.banner || undefined);

  if (!projeto) return <NaoEncontrado mensagem="Projeto não encontrado" />;

  const anterior = visiveis.length > 1 ? visiveis[(indice - 1 + visiveis.length) % visiveis.length] : undefined;
  const proximo = visiveis.length > 1 ? visiveis[(indice + 1) % visiveis.length] : undefined;
  const temPares = projeto.desafios.length > 0 || projeto.solucoes.length > 0;
  const textos = paragrafos(projeto.descricao);
  const imagemTopo = projeto.banner || projeto.capa;

  return (
    <PaginaBase>
      <article className="projeto">
        <header className="projeto-topo">
          <div className="container">
            <Link to="/#projetos" className="projeto-voltar"><FaArrowLeft aria-hidden="true" /> Voltar aos projetos</Link>
            <div className="projeto-topo-grade">
              <div>
                <p className="projeto-categoria">{[projeto.categoria, projeto.ano].filter(Boolean).join(" · ")}</p>
                <h1>{projeto.nome}</h1>
                {projeto.resumo && <p className="projeto-resumo">{projeto.resumo}</p>}
                {projeto.tecnologias.length > 0 && (
                  <ul className="chips" aria-label="Tecnologias usadas">
                    {projeto.tecnologias.map((t) => <li key={t} className="chip">{t}</li>)}
                  </ul>
                )}
                {(projeto.site || projeto.github) && (
                  <div className="projeto-acoes">
                    {projeto.site && (
                      <a className="botao botao-primario" href={projeto.site} target="_blank" rel="noopener noreferrer">
                        Ver o site <FaExternalLinkAlt aria-hidden="true" />
                      </a>
                    )}
                    {projeto.github && (
                      <a className="botao botao-contorno" href={projeto.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub aria-hidden="true" /> Ver o código
                      </a>
                    )}
                  </div>
                )}
              </div>
              {imagemTopo && (
                <div className="projeto-banner">
                  <img src={imagemTopo} alt={`Capa do projeto ${projeto.nome}`} width={1200} height={675} fetchPriority="high" />
                </div>
              )}
            </div>
          </div>
        </header>

        {textos.length > 0 && (
          <section className="secao secao-projeto" aria-labelledby="proj-sobre">
            <div className="container container-estreito">
              <Revelar>
                <CabecalhoSecao id="proj-sobre" titulo="Sobre o projeto" />
                <div className="projeto-texto">
                  {textos.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </Revelar>
            </div>
          </section>
        )}

        {projeto.prints.some((m) => m.src) && (
          <section className="secao secao-projeto" aria-labelledby="proj-galeria">
            <div className="container">
              <Revelar>
                <CabecalhoSecao id="proj-galeria" titulo="Galeria" subtitulo="Toque numa imagem para ampliar." />
                <GaleriaProjeto itens={projeto.prints} nome={projeto.nome} />
              </Revelar>
            </div>
          </section>
        )}

        {projeto.testes.length > 0 && (
          <section className="secao secao-projeto" aria-labelledby="proj-testes">
            <div className="container">
              <Revelar>
                <CabecalhoSecao id="proj-testes" titulo="Testes realizados" subtitulo="Como a qualidade deste projeto foi verificada." />
              </Revelar>
              <ul className="testes-grade">
                {projeto.testes.map((teste, i) => (
                  <li key={`${teste.nome}-${i}`}>
                    <Revelar atraso={(i % 3) * 80}>
                      <CartaoTeste teste={teste} />
                    </Revelar>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {temPares && (
          <section className="secao secao-projeto" aria-labelledby="proj-desafios">
            <div className="container">
              <Revelar>
                <CabecalhoSecao id="proj-desafios" titulo="Desafios e soluções" />
              </Revelar>
              <div className="pares-grade">
                {projeto.desafios.length > 0 && (
                  <Revelar>
                    <div className="par-bloco par-desafios">
                      <h3>Desafios</h3>
                      <ul>{projeto.desafios.map((d, i) => <li key={i}>{d}</li>)}</ul>
                    </div>
                  </Revelar>
                )}
                {projeto.solucoes.length > 0 && (
                  <Revelar atraso={100}>
                    <div className="par-bloco par-solucoes">
                      <h3>Soluções</h3>
                      <ul>{projeto.solucoes.map((d, i) => <li key={i}>{d}</li>)}</ul>
                    </div>
                  </Revelar>
                )}
              </div>
            </div>
          </section>
        )}

        {anterior && proximo && (
          <nav className="projeto-navegacao container" aria-label="Outros projetos">
            <Link to={`/projeto/${anterior.slug}`} className="projeto-nav-link">
              <small><FaArrowLeft aria-hidden="true" /> Anterior</small>
              <span>{anterior.nome}</span>
            </Link>
            <Link to={`/projeto/${proximo.slug}`} className="projeto-nav-link projeto-nav-prox">
              <small>Próximo <FaArrowRight aria-hidden="true" /></small>
              <span>{proximo.nome}</span>
            </Link>
          </nav>
        )}
      </article>
    </PaginaBase>
  );
}

function CartaoTeste({ teste }: { teste: TipoTeste }) {
  const [aberto, setAberto] = useState(false);
  const src = teste.video || teste.imagem;
  const midia: Midia = { tipo: teste.video ? "video" : "img", src, legenda: teste.nome };
  return (
    <>
      {src ? (
        <button type="button" className="teste-card teste-card-clicavel" onClick={() => setAberto(true)} aria-label={`Clique para ver a evidência: ${teste.nome}`}>
          <span className="teste-icone" aria-hidden="true">{teste.video ? <FaPlay /> : <FaSearchPlus />}</span>
          <span className="teste-card-conteudo">
            <strong>{teste.nome}</strong>
            {teste.descricao && <span className="teste-descricao">{teste.descricao}</span>}
            <span className="teste-ver">Clique para ver {teste.video ? "o vídeo" : "a imagem"}</span>
          </span>
        </button>
      ) : (
        <article className="teste-card">
          <span className="teste-icone" aria-hidden="true"><FaVial /></span>
          <h3>{teste.nome}</h3>
          {teste.descricao && <p>{teste.descricao}</p>}
        </article>
      )}
      {aberto && <Lightbox itens={[midia]} indice={0} onMudar={() => {}} onFechar={() => setAberto(false)} />}
    </>
  );
}
