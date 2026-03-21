import { useState } from "react";
import GaleriaModal from "./GaleriaModal";
import { useNavigate } from "react-router-dom";

type Props = {
  projeto: any;
  fechar: () => void;
};

export default function ProjetoModal({ projeto, fechar }: Props) {
  const navigate = useNavigate();
  const [imagemSelecionada, setImagemSelecionada] = useState<any>(null);

  if (!projeto) return null;

  return (
    <>
      <div className="modal-overlay" onClick={fechar}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>

          {/* HEADER */}
          <div className="modal-header">
            <img 
              src={projeto.imagem} 
              alt={projeto.nome}
              onClick={() => setImagemSelecionada({ tipo: "img", src: projeto.imagem })}
              style={{ cursor: "pointer" }}
            />

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
  const isMobile = window.innerWidth <= 1024;

  if (isMobile) {
    // 📱 mobile / tablet → mesma aba
    navigate(`/projeto/${projeto.slug}`);
  } else {
    // 💻 desktop → nova aba
    window.open(`/projeto/${projeto.slug}`, "_blank");
  }

  fechar();
}}
            >
              Detalhes do Projeto
            </button>
          </div>

        </div>
      </div>

      {/* GALERIA MODAL */}
      <GaleriaModal
        item={imagemSelecionada}
        fechar={() => setImagemSelecionada(null)}
      />
    </>
  );
}