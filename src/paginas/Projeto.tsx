import { useParams } from "react-router-dom";
import "../estilos/projeto.css";
import { projetos } from "../data/projetos";



export default function Projeto() {
  const { id } = useParams();
  const projetoId = parseInt(id || "0");
  const projeto = projetos.find(p => p.id === projetoId);

  if (!projeto) {
    return <div>Projeto não encontrado</div>;
  }

  return (
    <div className="projeto-container">
      
      {/* HERO */}
      <div className="projeto-hero">
        <img src={projeto.imagem} alt={projeto.nome} />
        <h1>{projeto.nome}</h1>
      </div>

      {/* DESCRIÇÃO */}
      <section>
        <h2>Sobre o Projeto</h2>
        <p>{projeto.descricao}</p>
      </section>

      {/* GALERIA DE PRINTS */}
      <section>
        <h2>Galeria do Projeto</h2>
          <div className="galeria">
            {projeto.prints.map((img, i) => (
            <img key={i} src={img} alt={`print ${i}`} />
          ))}
        </div>
      </section>

      {/* TECNOLOGIAS */}
      <section>
        <h2>Tecnologias</h2>
        <div className="techs">
          {projeto.tecnologias.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </section>

      {/* TESTES */}
      <section>
        <h2>Testes Realizados</h2>
        <div className="testes">
          {projeto.testes.map((teste, i) => (
            <div key={i} className="teste-card">
              <img src={teste.imagem} alt={teste.nome} />
              <p>{teste.nome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESAFIOS */}
      <section>
        <h2>Desafios</h2>
        <p>{projeto.desafios}</p>
      </section>

      {/* SOLUÇÕES */}
      <section>
        <h2>Soluções</h2>
        <p>{projeto.solucoes}</p>
      </section>

      {/* BOTÃO GITHUB */}
      <a href={projeto.github} target="_blank" className="btn-github">
        Ver no GitHub
      </a>

    </div>
  );
}