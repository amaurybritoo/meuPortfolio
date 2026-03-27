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
      imagem: "/Projetos/site-andreia/img/banner.png",
    },
    {
      id: 2,
      nome: "Curso de QA da EBAC",
      slug: "Curso de QA da EBAC",
      descricao: "Projeto de automação de testes end-to-end desenvolvido com Cypress para validação das funcionalidades da loja EBAC Shop, simulando o comportamento real do usuário.",
      imagem: "./projetos/curso-ebac/img/banner-ebac.png",
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