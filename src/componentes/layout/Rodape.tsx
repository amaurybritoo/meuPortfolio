import { Link } from "react-router-dom";
import { usePortfolio } from "../../contexto/usePortfolio";
import Icone from "../comuns/Icone";
import "../../estilos/rodape.css";

const ANO_ATUAL = new Date().getFullYear();

export default function Rodape() {
  const { dados } = usePortfolio();
  const { perfil } = dados;
  return (
    <footer className="rodape">
      <div className="container rodape-conteudo">
        <Link to="/" className="rodape-marca" aria-label="Voltar ao início">
          {perfil.logo && <img src={perfil.logo} alt="" width={44} height={44} loading="lazy" />}
          <span>
            <strong>{perfil.nome}</strong>
            <small>{perfil.cargos.join(" · ")}</small>
          </span>
        </Link>

        {perfil.redes.length > 0 && (
          <ul className="rodape-redes" aria-label="Redes sociais">
            {perfil.redes.map((rede) => (
              <li key={rede.id}>
                <a href={rede.url} target="_blank" rel="noopener noreferrer" aria-label={rede.rotulo}>
                  <Icone nome={rede.icone} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="container rodape-base">
        <p>{perfil.rodape}</p>
        <p>© {ANO_ATUAL} {perfil.nome}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
