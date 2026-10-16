import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaStar } from "react-icons/fa";
import type { Projeto } from "../../tipos";
import Icone from "../comuns/Icone";

const MAX_TECNOLOGIAS = 4;

/**
 * Card de projeto. O card INTEIRO é clicável: o link do título "estica" por cima de todo o card
 * (veja .card-link::after no CSS). Os ícones de site/GitHub ficam acima e funcionam separados.
 */
export default function CardProjeto({ projeto }: { projeto: Projeto }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const tecnologias = projeto.tecnologias.slice(0, MAX_TECNOLOGIAS);
  const restantes = projeto.tecnologias.length - tecnologias.length;
  const temImagem = Boolean(projeto.capa) && !imagemFalhou;

  return (
    <article className="card-projeto">
      <div className="card-midia">
        {temImagem ? (
          <img
            src={projeto.capa}
            alt={`Prévia do projeto ${projeto.nome}`}
            loading="lazy"
            decoding="async"
            width={800}
            height={450}
            onError={() => setImagemFalhou(true)}
          />
        ) : (
          <div className="card-sem-imagem" aria-hidden="true">
            <Icone nome="codigo" />
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
      </div>

      <div className="card-corpo">
        <h3 className="card-titulo">
          <Link to={`/projeto/${projeto.slug}`} className="card-link">
            {projeto.nome}
          </Link>
        </h3>
        {projeto.resumo && <p className="card-resumo">{projeto.resumo}</p>}

        {tecnologias.length > 0 && (
          <ul className="chips" aria-label="Tecnologias">
            {tecnologias.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
            {restantes > 0 && <li className="chip chip-mais">+{restantes}</li>}
          </ul>
        )}

        <div className="card-rodape">
          <span className="card-ver">
            Ver projeto <FaArrowRight aria-hidden="true" />
          </span>
          <div className="card-externos">
            {projeto.site && (
              <a href={projeto.site} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o site de ${projeto.nome}`} title="Abrir o site">
                <FaExternalLinkAlt aria-hidden="true" />
              </a>
            )}
            {projeto.github && (
              <a href={projeto.github} target="_blank" rel="noopener noreferrer" aria-label={`Ver o código de ${projeto.nome} no GitHub`} title="Ver o código">
                <FaGithub aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
