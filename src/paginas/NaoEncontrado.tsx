import { Link } from "react-router-dom";
import { usePortfolio } from "../contexto/usePortfolio";
import { useSeo } from "../componentes/comuns/useSeo";
import PaginaBase from "../componentes/layout/PaginaBase";

export default function NaoEncontrado({ mensagem = "Página não encontrada" }: { mensagem?: string }) {
  const { dados } = usePortfolio();
  useSeo(`${mensagem} | ${dados.perfil.nome}`, dados.seo.descricao);
  return (
    <PaginaBase>
      <section className="container nao-encontrado">
        <p className="nao-encontrado-codigo" aria-hidden="true">404</p>
        <h1>{mensagem}</h1>
        <p>O endereço que você abriu não existe ou o conteúdo foi movido.</p>
        <div className="nao-encontrado-acoes">
          <Link to="/" className="botao botao-primario">Voltar ao início</Link>
          <Link to="/#projetos" className="botao botao-contorno">Ver projetos</Link>
        </div>
      </section>
    </PaginaBase>
  );
}
