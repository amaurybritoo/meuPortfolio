import { Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../../contexto/usePortfolio";
import { sairDoPreview } from "../../utilitarios/armazenamento";

/** Faixa que avisa que o site está mostrando o rascunho do admin (só quem abriu a prévia vê). */
export default function BannerPreview() {
  const { preview } = usePortfolio();
  const navegar = useNavigate();
  if (!preview) return null;

  const sair = () => {
    sairDoPreview();
    navegar("/?preview=0");
  };

  return (
    <div className="banner-preview" role="status">
      <span>Pré-visualização do rascunho: isto ainda não foi publicado.</span>
      <Link to="/admin">Voltar ao admin</Link>
      <button type="button" onClick={sair}>Sair da prévia</button>
    </div>
  );
}
