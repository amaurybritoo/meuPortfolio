import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaGithub, FaLayerGroup, FaPlay, FaSearchPlus, FaVial } from "react-icons/fa";
import { usePortfolio } from "../contexto/usePortfolio";
import CabecalhoSecao from "../componentes/comuns/CabecalhoSecao";
import { Markdown, MarkdownEmLinha } from "../componentes/comuns/Markdown";
import Revelar from "../componentes/comuns/Revelar";
import { useSeo } from "../componentes/comuns/useSeo";
import CardProjeto from "../componentes/home/CardProjeto";
import PaginaBase from "../componentes/layout/PaginaBase";
import GaleriaProjeto from "../componentes/projeto/GaleriaProjeto";
import Lightbox from "../componentes/projeto/Lightbox";
import type { Midia, Teste as TipoTeste } from "../tipos";
import { conjuntoDoMembro, idsEmConjuntos, imagemDoProjeto, membrosDoConjunto } from "../utilitarios/conjuntos";
import NaoEncontrado from "./NaoEncontrado";
import "../estilos/projetos.css";
import "../estilos/projeto.css";

export default function Projeto() {
  const [bannerAberto, setBannerAberto] = useState(false);
  // Deixa a lista da página inicial pronta antes de o usuário voltar do projeto.
  useEffect(() => {
    void import("../componentes/home/HomeAbaixoDaDobra");
  }, []);

  const { slug = "" } = useParams();
  const { dados, projetos: visiveis } = usePortfolio();
  const projeto = visiveis.find((p) => p.slug === slug);
  useSeo(projeto ? `${projeto.nome} | ${dados.perfil.nome}` : `Projeto não encontrado | ${dados.perfil.nome}`, projeto?.resumo || dados.seo.descricao, (projeto && imagemDoProjeto(projeto)) || undefined);

  if (!projeto) return <NaoEncontrado mensagem="Projeto não encontrado" />;

  // Conjunto: mostra os projetos que fazem parte dele. Projeto dentro de um conjunto: volta para o conjunto.
  const membros = membrosDoConjunto(projeto, visiveis);
  const ehConjunto = membros.length > 0;
  const conjuntoPai = ehConjunto ? undefined : conjuntoDoMembro(projeto, visiveis);

  // Anterior/próximo seguem a mesma lista que o visitante vê na página inicial: os projetos soltos
  // e os conjuntos. Quem está dentro de um conjunto navega só entre os irmãos dele.
  const emConjuntos = idsEmConjuntos(visiveis);
  const navegaveis = conjuntoPai ? membrosDoConjunto(conjuntoPai, visiveis) : visiveis.filter((p) => !emConjuntos.has(p.id));
  const indice = navegaveis.findIndex((p) => p.id === projeto.id);
  const temNavegacao = indice >= 0 && navegaveis.length > 1;
  const anterior = temNavegacao ? navegaveis[(indice - 1 + navegaveis.length) % navegaveis.length] : undefined;
  const proximo = temNavegacao ? navegaveis[(indice + 1) % navegaveis.length] : undefined;

  const temPares = projeto.desafios.length > 0 || projeto.solucoes.length > 0;
  const textos = projeto.descricao.trim();
  // No conjunto, a descrição só ganha seção própria quando traz algo além do resumo do topo.
  const mostrarSobre = textos.length > 0 && (!ehConjunto || textos !== projeto.resumo.trim());
  const imagemTopo = ehConjunto ? "" : projeto.banner;

  return (
    <PaginaBase>
      <article className="projeto" key={projeto.id}>
        <header className="projeto-topo">
          <div className="container">
            {conjuntoPai ? <>
              <Link to={`/projeto/${conjuntoPai.slug}`} className="projeto-voltar"><FaArrowLeft aria-hidden="true" /> Voltar ao conjunto {conjuntoPai.nome}</Link>
              <Link to="/#projetos" className="projeto-voltar"><FaArrowLeft aria-hidden="true" /> Voltar ao início</Link>
            </> : <Link to="/#projetos" className="projeto-voltar"><FaArrowLeft aria-hidden="true" /> Voltar aos projetos</Link>}
            <div className={`projeto-topo-grade${ehConjunto && !imagemTopo ? " projeto-topo-sem-imagem" : ""}`}>
              <div>
                {ehConjunto && <span className="projeto-selo-conjunto"><FaLayerGroup aria-hidden="true" /> Conjunto · {membros.length} {membros.length === 1 ? "projeto" : "projetos"}</span>}
                <p className="projeto-categoria">{[projeto.categoria, projeto.ano].filter(Boolean).join(" · ")}</p>
                <h1>{projeto.nome}</h1>
                {projeto.resumo && <Markdown className="projeto-resumo" texto={projeto.resumo} />}
                {!ehConjunto && projeto.tecnologias.length > 0 && (
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
                <button type="button" className="projeto-banner projeto-banner-botao" onClick={() => setBannerAberto(true)} aria-label={`Ampliar banner de ${projeto.nome}`}>
                  <img src={imagemTopo} alt={`Capa do projeto ${projeto.nome}`} width={1200} height={675} fetchPriority="high" />
                </button>
              )}
            </div>
          </div>
        </header>

        {mostrarSobre && (
          <section className="secao secao-projeto" aria-labelledby="proj-sobre">
            <div className="container">
              <Revelar>
                <CabecalhoSecao id="proj-sobre" titulo={ehConjunto ? "Sobre o conjunto" : "Sobre o projeto"} />
                <div className="projeto-texto">
                  <Markdown texto={textos} />
                </div>
              </Revelar>
            </div>
          </section>
        )}

        {ehConjunto && (
          <section className="secao secao-projeto" aria-labelledby="proj-conjunto">
            <div className="container">
              <Revelar>
                <CabecalhoSecao id="proj-conjunto" titulo="Projetos deste conjunto" subtitulo={`${membros.length} ${membros.length === 1 ? "projeto faz" : "projetos fazem"} parte de ${projeto.nome}. Escolha um para ver os detalhes.`} />
              </Revelar>
              <ul className="conjunto-grade">
                {membros.map((membro, i) => (
                  <li key={membro.id}>
                    <Revelar atraso={(i % 3) * 90}>
                      <CardProjeto projeto={membro} projetos={visiveis} />
                    </Revelar>
                  </li>
                ))}
              </ul>
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
                      <ul>{projeto.desafios.map((d, i) => <li key={i}><Markdown texto={d} /></li>)}</ul>
                    </div>
                  </Revelar>
                )}
                {projeto.solucoes.length > 0 && (
                  <Revelar atraso={100}>
                    <div className="par-bloco par-solucoes">
                      <h3>Soluções</h3>
                      <ul>{projeto.solucoes.map((d, i) => <li key={i}><Markdown texto={d} /></li>)}</ul>
                    </div>
                  </Revelar>
                )}
              </div>
            </div>
          </section>
        )}

        {anterior && proximo && (
          <nav className="projeto-navegacao container" aria-label={conjuntoPai ? `Outros projetos de ${conjuntoPai.nome}` : "Outros projetos"}>
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
      {bannerAberto && imagemTopo && <Lightbox itens={[{ tipo: "img", src: imagemTopo, legenda: projeto.nome }]} indice={0} onMudar={() => {}} onFechar={() => setBannerAberto(false)} />}
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
            {teste.descricao && <span className="teste-descricao">{MarkdownEmLinha({ texto: teste.descricao })}</span>}
            <span className="teste-ver">Clique para ver {teste.video ? "o vídeo" : "a imagem"}</span>
          </span>
        </button>
      ) : (
        <article className="teste-card">
          <span className="teste-icone" aria-hidden="true"><FaVial /></span>
          <h3>{teste.nome}</h3>
          {teste.descricao && <Markdown texto={teste.descricao} />}
        </article>
      )}
      {aberto && <Lightbox itens={[midia]} indice={0} onMudar={() => {}} onFechar={() => setAberto(false)} />}
    </>
  );
}
