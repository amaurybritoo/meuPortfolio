import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePortfolio } from "../../contexto/usePortfolio";
import LinkSecao from "./LinkSecao";
import "../../estilos/navbar.css";

interface ItemMenu {
  id: string;
  rotulo: string;
}

export default function Navbar() {
  const { dados, projetos } = usePortfolio();
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(() => window.scrollY > 12);
  const [secaoAtiva, setSecaoAtiva] = useState("");
  const { perfil, secoes } = dados;

  const itens = useMemo<ItemMenu[]>(() => {
    const lista: ItemMenu[] = [];
    if (secoes.sobre.ativa && (perfil.sobre.length > 0 || perfil.resumo)) lista.push({ id: "sobre", rotulo: "Sobre" });
    if (secoes.habilidades.ativa && dados.habilidades.length > 0) lista.push({ id: "habilidades", rotulo: "Habilidades" });
    if (secoes.projetos.ativa && projetos.length > 0) lista.push({ id: "projetos", rotulo: "Projetos" });
    if (secoes.formacao.ativa && dados.formacoes.length > 0) lista.push({ id: "formacao", rotulo: "Formação" });
    if (secoes.contato.ativa) lista.push({ id: "contato", rotulo: "Contato" });
    return lista;
  }, [dados, projetos, perfil, secoes]);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  // destaca no menu a seção que está na tela (só na página inicial)
  useEffect(() => {
    if (pathname !== "/" || !("IntersectionObserver" in window)) return;
    const elementos = itens.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    if (elementos.length === 0) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setSecaoAtiva(visivel.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6] },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [itens, pathname]);

  return (
    <header className={`navbar ${rolou ? "navbar-rolou" : ""} ${aberto ? "navbar-aberta" : ""}`}>
      <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <div className="navbar-conteudo">
        <Link to="/" className="navbar-marca" aria-label={`${perfil.nome} — página inicial`} onClick={() => setAberto(false)}>
          {perfil.logo && <img className="logo-pulsante" src={perfil.logo} alt="" width={56} height={56} />}
          <span>{perfil.nome}</span>
        </Link>

        <nav id="menu-principal" className="navbar-menu" aria-label="Principal">
          <ul>
            {itens.map((item) => (
              <li key={item.id}>
                <LinkSecao id={item.id} className={secaoAtiva === item.id && pathname === "/" ? "ativo" : ""} onClick={() => setAberto(false)}>
                  {item.rotulo}
                </LinkSecao>
              </li>
            ))}
          </ul>
          {perfil.curriculo && (
            <a className="botao botao-contorno botao-pequeno" href={perfil.curriculo} target="_blank" rel="noopener noreferrer">
              Currículo
            </a>
          )}
        </nav>

        <button
          type="button"
          className="navbar-botao"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
