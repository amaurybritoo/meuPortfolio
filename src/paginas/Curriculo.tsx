import { useEffect } from "react";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { Link } from "react-router-dom";
import { usePortfolio } from "../contexto/usePortfolio";
import { formatarWhatsAppBrasil } from "../utilitarios/texto";
import "../estilos/curriculo.css";

export default function Curriculo() {
  const { dados } = usePortfolio();
  const { perfil } = dados;
  useEffect(() => {
    document.title = `Currículo | ${perfil.nome}`;
    if (new URLSearchParams(window.location.search).has("imprimir")) {
      const timer = window.setTimeout(() => window.print(), 500);
      return () => window.clearTimeout(timer);
    }
  }, [perfil.nome]);

  return <main className="curriculo-pagina">
    <nav className="curriculo-acoes" aria-label="Ações do currículo">
      <Link to="/" className="curriculo-voltar"><FaArrowLeft aria-hidden="true" /> Voltar ao portfólio</Link>
      <button type="button" onClick={() => window.print()}><FaPrint aria-hidden="true" /> Salvar como PDF</button>
    </nav>
    <article className="curriculo-folha">
      <header className="curriculo-cabecalho">
        <div><h1>{perfil.nome}</h1><p className="curriculo-cargos">{perfil.cargos.join(" · ")}</p></div>
        <address className="curriculo-contatos">
          {perfil.localizacao && <span>{perfil.localizacao}</span>}
          {perfil.email && <a href={`mailto:${perfil.email}`}>{perfil.email}</a>}
          {perfil.whatsapp && <a href={`https://wa.me/${perfil.whatsapp}`}>WhatsApp · {formatarWhatsAppBrasil(perfil.whatsapp)}</a>}
          {perfil.redes.filter((rede) => rede.url).map((rede) => <a key={rede.id} href={rede.url}>{rede.rotulo} · {rede.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>)}
        </address>
      </header>
      {perfil.resumo && <section><h2>Resumo profissional</h2><p>{perfil.resumo}</p></section>}
      {perfil.sobre.length > 0 && <section><h2>Perfil</h2>{perfil.sobre.map((p, i) => <p key={i}>{p}</p>)}</section>}
      {dados.experiencias.length > 0 && <section><h2>Experiência profissional</h2>{dados.experiencias.map((e) => <div className="curriculo-item" key={e.id}><div className="curriculo-item-topo"><h3>{e.titulo}</h3><span>{e.periodo}</span></div><p className="curriculo-local">{e.local}</p>{e.descricao && <p>{e.descricao}</p>}</div>)}</section>}
      {dados.formacoes.length > 0 && <section><h2>Formação</h2>{dados.formacoes.map((f) => <div className="curriculo-item" key={f.id}><div className="curriculo-item-topo"><h3>{f.titulo}</h3><span>{f.periodo}</span></div><p className="curriculo-local">{f.local}</p>{f.descricao && <p>{f.descricao}</p>}</div>)}</section>}
      {dados.habilidades.some((g) => g.itens.length) && <section><h2>Competências</h2><p>{dados.habilidades.flatMap((g) => g.itens.map((i) => i.nome)).join(" · ")}</p></section>}
      {dados.projetos.filter((p) => p.visivel).length > 0 && <section><h2>Projetos selecionados</h2>{dados.projetos.filter((p) => p.visivel).map((p) => <div className="curriculo-item" key={p.id}><h3>{p.nome}</h3><p>{p.resumo}</p>{p.tecnologias.length > 0 && <p className="curriculo-local">{p.tecnologias.join(" · ")}</p>}{p.site && <a href={p.site}>{p.site}</a>}</div>)}</section>}
    </article>
  </main>;
}
