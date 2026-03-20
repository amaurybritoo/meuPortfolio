//import { useNavigate } from "react-router-dom";

type Props = {
  projeto: any;
  fechar: () => void;
};

export default function ProjetoModal({ projeto, fechar }: Props) {
 // const navigate = useNavigate();

  if (!projeto) return null;

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <img src={projeto.imagem} alt={projeto.nome} />

          <div className="modal-titulo">
            <h2>{projeto.nome}</h2>
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div className="modal-body">
          <p>{projeto.descricao}</p>
        </div>

        {/* BOTÕES */}
        <div className="modal-botoes">
          <button className="btn-fechar" onClick={fechar}>
            Fechar
          </button>

          <button
            className="btn-detalhes"
          onClick={() => {
  window.open(`/projeto/${projeto.id}`, "_blank");
  fechar();
}}
          >
            Detalhes do Projeto
          </button>
        </div>

      </div>
    </div>
  );
}