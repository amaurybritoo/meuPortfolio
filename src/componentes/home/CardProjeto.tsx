import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaLayerGroup, FaStar } from "react-icons/fa";
import type { Projeto } from "../../tipos";
import { imagemDoProjeto, membrosDoConjunto } from "../../utilitarios/conjuntos";
import Icone from "../comuns/Icone";
import { MarkdownEmLinha } from "../comuns/Markdown";
import PopupConjunto from "./PopupConjunto";

const MAX_TECNOLOGIAS = 4;
const MAX_MEMBROS_NO_CARD = 3;
const MAX_MINIATURAS = 4;

/**
 * Card de projeto. O card INTEIRO é clicável: o link do título "estica" por cima de todo o card
 * (veja .card-link::after no CSS). Os ícones de site/GitHub ficam acima e funcionam separados.
 *
 * O título estica sobre o card inteiro; links externos continuam separados.
 */
export default function CardProjeto({ projeto, projetos }: { projeto: Projeto; projetos: Projeto[] }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const [conjuntoAberto, setConjuntoAberto] = useState(false);
  const membros = useMemo(() => membrosDoConjunto(projeto, projetos), [projeto, projetos]);
  const temConjunto = membros.length > 0;
  const todasTecnologias = temConjunto ? [] : projeto.tecnologias;
  const tecnologias = todasTecnologias.slice(0, MAX_TECNOLOGIAS);
  const restantes = todasTecnologias.length - tecnologias.length;
  const imagem = imagemDoProjeto(projeto);
  const temImagem = Boolean(imagem) && !imagemFalhou;
  const miniaturas = temConjunto && !temImagem ? membros.map((m) => ({ id: m.id, nome: m.nome, src: imagemDoProjeto(m) })).filter((m) => m.src).slice(0, MAX_MINIATURAS) : [];
  const membrosVisiveis = membros.slice(0, MAX_MEMBROS_NO_CARD);
  const membrosOcultos = membros.length - membrosVisiveis.length;

  return (
    <>
    <article className={`card-projeto${temConjunto ? " card-conjunto" : ""}`}>
      <div className="card-midia">
        {temImagem ? (
          <img
            src={imagem}
            alt={`Prévia do projeto ${projeto.nome}`}
            loading="lazy"
            decoding="async"
            width={800}
            height={450}
            onError={() => setImagemFalhou(true)}
          />
        ) : miniaturas.length > 0 ? (
          <div className={`card-mosaico card-mosaico-${miniaturas.length}`} aria-hidden="true">
            {miniaturas.map((m) => <img key={m.id} src={m.src} alt="" loading="lazy" decoding="async" />)}
          </div>
        ) : (
          <div className="card-sem-imagem" aria-hidden="true">
            {temConjunto ? <FaLayerGroup /> : <Icone nome="codigo" />}
            <span>{projeto.nome}</span>
          </div>
        )}
        {projeto.categoria && <span className="card-categoria">{projeto.categoria}</span>}
        {!projeto.visivel && <span className="card-destaque card-rascunho">Rascunho</span>}
        {projeto.visivel && projeto.destaque && (
          <span className="card-destaque">
            <FaStar aria-hidden="true" /> Destaque
          </span>
        )}
        {temConjunto && <span className="card-selo-conjunto"><FaLayerGroup aria-hidden="true" /> Conjunto · {membros.length} {membros.length === 1 ? "projeto" : "projetos"}</span>}
      </div>

      <div className="card-corpo">
        <h3 className="card-titulo">
          {temConjunto ? (
            <button type="button" className="card-titulo-botao" aria-haspopup="dialog" onClick={() => setConjuntoAberto(true)}>{projeto.nome}</button>
          ) : <Link
              to={`/projeto/${projeto.slug}`}
              className="card-link"
              onPointerEnter={() => { void import("../../paginas/Projeto"); }}
              onFocus={() => { void import("../../paginas/Projeto"); }}
              onTouchStart={() => { void import("../../paginas/Projeto"); }}
            >
              {projeto.nome}
          </Link>}
        </h3>
        {projeto.resumo && <p className="card-resumo">{MarkdownEmLinha({ texto: projeto.resumo })}</p>}

        {temConjunto && (
          <div className="card-conjunto-nomes">
            <strong>Neste conjunto</strong>
            <ul>
              {membrosVisiveis.map((membro) => <li key={membro.id}>{membro.nome}</li>)}
              {membrosOcultos > 0 && <li className="card-conjunto-mais">+{membrosOcultos} {membrosOcultos === 1 ? "projeto" : "projetos"}</li>}
            </ul>
          </div>
        )}

        {tecnologias.length > 0 && (
          <ul className="chips" aria-label="Tecnologias">
            {tecnologias.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
            {restantes > 0 && <li className="chip chip-mais">+{restantes}</li>}
          </ul>
        )}

        <div className="card-rodape">
          {temConjunto ? (
            <span className="card-ver">Abrir conjunto <FaArrowRight aria-hidden="true" /></span>
          ) : (
            <span className="card-ver">Ver projeto <FaArrowRight aria-hidden="true" /></span>
          )}
          <div className="card-externos">
            {projeto.site && (
              <a className="card-botao-site" href={projeto.site} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o site de ${projeto.nome}`}>
                Ver site <FaExternalLinkAlt aria-hidden="true" />
              </a>
            )}
            {!temConjunto && projeto.github && (
              <a href={projeto.github} target="_blank" rel="noopener noreferrer" aria-label={`Ver o código de ${projeto.nome} no GitHub`} title="Ver o código">
                <FaGithub aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
    {conjuntoAberto && temConjunto && <PopupConjunto conjunto={projeto} projetos={membros} onFechar={() => setConjuntoAberto(false)} />}
    </>
  );
}
