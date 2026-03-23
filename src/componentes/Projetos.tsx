import "../estilos/projetos.css";
import { useState } from "react";
import ProjetoModal from "./ProjetoModal";

export default function Projetos() {
  // estado do modal (projeto selecionado)
  const [selecionado, setSelecionado] = useState<any>(null);

  // lista de projetos (depois você pode puxar do backend)
  const projetos = [
    {
      id: 1,
      nome: "Site da Dra.Andréia",
      slug: "projeto-andreia",
      descricao: "Landing Page moderna e responsiva, focada em conversão e experiência do usuário.",
      imagem: "/Projetos/site-andreia/banner.png",
    },
    {
      id: 2,
      nome: "Dashboard",
      slug: "dashboard",
      descricao: "Painel interativo com gráficos",
      imagem: "https://picsum.photos/500/300?2",
    },
    {
      id: 3,
      nome: "Landing Page",
      slug: "landing-page",
      descricao: "Página otimizada para conversão",
      imagem: "https://picsum.photos/500/300?3",
    },
    
  ];

  return (
    <section id="projetos" className="projetos">
      <h2>Projetos</h2>

      <div className="grid-projetos">
        {projetos.map((proj) => (
          <div
            key={proj.id}
            className="card-projeto aparecer"
            onClick={() => setSelecionado(proj)} // 🔥 abre modal
          >
            <img src={proj.imagem} alt={proj.nome} />

            <div className="conteudo">
              <h3>{proj.nome}</h3>
              <p>{proj.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ProjetoModal
        projeto={selecionado}
        fechar={() => setSelecionado(null)}
      />
    </section>
  );
}