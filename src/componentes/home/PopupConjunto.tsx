import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaLayerGroup, FaTimes } from "react-icons/fa";
import type { Projeto } from "../../tipos";
import { imagemDoProjeto } from "../../utilitarios/conjuntos";
import { Markdown, MarkdownEmLinha } from "../comuns/Markdown";
import "../../estilos/popup-conjunto.css";

/**
 * Modal de um conjunto: título e descrição do conjunto no alto e, abaixo, um card para cada
 * projeto que faz parte dele. O topo e o rodapé ficam fixos; só a área do meio rola.
 */
export default function PopupConjunto({ conjunto, projetos, onFechar }: { conjunto: Projeto; projetos: Projeto[]; onFechar: () => void }) {
  const fecharRef = useRef<HTMLButtonElement>(null);
  const aoFecharRef = useRef(onFechar);
  useEffect(() => { aoFecharRef.current = onFechar; }, [onFechar]);

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("lightbox-aberto");
    fecharRef.current?.focus();
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") { aoFecharRef.current(); return; }
      if (evento.key !== "Tab") return;
      const focaveis = Array.from(document.querySelectorAll<HTMLElement>(".popup-conjunto button:not([disabled]), .popup-conjunto a[href]"));
      if (!focaveis.length) return;
      if (evento.shiftKey && document.activeElement === focaveis[0]) { evento.preventDefault(); focaveis.at(-1)?.focus(); }
      else if (!evento.shiftKey && document.activeElement === focaveis.at(-1)) { evento.preventDefault(); focaveis[0].focus(); }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.documentElement.classList.remove("lightbox-aberto");
      anterior?.focus?.();
    };
  }, []);

  const descricao = conjunto.descricao.trim() || conjunto.resumo.trim();
  const total = projetos.length;

  return createPortal(
    <div className="popup-conjunto-fundo" onClick={(evento) => { if (evento.target === evento.currentTarget) onFechar(); }}>
      <section className="popup-conjunto" role="dialog" aria-modal="true" aria-labelledby="popup-conjunto-titulo" aria-describedby="popup-conjunto-descricao">
        <header className="popup-conjunto-topo">
          <div className="popup-conjunto-identidade">
            <span className="popup-conjunto-selo"><FaLayerGroup aria-hidden="true" /> Conjunto · {total} {total === 1 ? "projeto" : "projetos"}</span>
            <h2 id="popup-conjunto-titulo">{conjunto.nome}</h2>
          </div>
          <button ref={fecharRef} type="button" className="popup-conjunto-fechar" onClick={onFechar} aria-label="Fechar conjunto"><FaTimes aria-hidden="true" /></button>
        </header>

        <div className="popup-conjunto-corpo">
          <div className="popup-conjunto-intro">
            {descricao && <div id="popup-conjunto-descricao" className="popup-conjunto-descricao"><Markdown texto={descricao} /></div>}
          </div>

          <h3 className="popup-conjunto-subtitulo">Projetos deste conjunto</h3>
          <ul className="popup-conjunto-grade" data-quantidade={total > 2 ? "varios" : total}>
            {projetos.map((projeto) => {
              const imagem = imagemDoProjeto(projeto);
              const resumo = projeto.resumo.trim() || projeto.descricao.trim();
              return (
                <li key={projeto.id}>
                  <article className="popup-membro">
                    <div className="popup-membro-imagem">
                      {imagem ? <img src={imagem} alt={`Prévia de ${projeto.nome}`} loading="lazy" decoding="async" /> : <div className="popup-membro-sem-imagem" aria-hidden="true"><FaLayerGroup /><span>{projeto.nome}</span></div>}
                      {!projeto.visivel && <span className="popup-membro-rascunho">Rascunho</span>}
                    </div>
                    <div className="popup-membro-corpo">
                      {(projeto.categoria || projeto.ano) && <p className="popup-membro-categoria">{[projeto.categoria, projeto.ano].filter(Boolean).join(" · ")}</p>}
                      <h4>{projeto.nome}</h4>
                      {resumo && <p className="popup-membro-resumo">{MarkdownEmLinha({ texto: resumo })}</p>}
                      <div className="popup-membro-acoes">
                        <Link className="botao botao-primario botao-pequeno" to={`/projeto/${projeto.slug}`} onClick={onFechar}>Ver projeto <FaArrowRight aria-hidden="true" /></Link>
                        {projeto.site && <a className="botao botao-contorno botao-pequeno" href={projeto.site} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o site de ${projeto.nome}`}>Site <FaExternalLinkAlt aria-hidden="true" /></a>}
                        {projeto.github && <a className="botao botao-contorno botao-pequeno" href={projeto.github} target="_blank" rel="noopener noreferrer" aria-label={`Ver o código de ${projeto.nome} no GitHub`}><FaGithub aria-hidden="true" /> Código</a>}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="popup-conjunto-rodape">
          <Link className="botao botao-contorno botao-pequeno" to={`/projeto/${conjunto.slug}`} onClick={onFechar}>Ver página do conjunto <FaArrowRight aria-hidden="true" /></Link>
          <button type="button" className="botao botao-texto botao-pequeno" onClick={onFechar}>Fechar</button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
