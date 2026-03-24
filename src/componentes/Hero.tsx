import "../estilos/hero.css";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Hero() {

  // função pra rolar até projetos
  const scroll = () => {
    document.getElementById("projetos")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="hero">

      {/* ESQUERDA - texto principal */}
      <div className="left">
        <h1>Amaury Brito</h1>

        {/* cargo */}
        <p className="cargo">Front-end Developer & QA Engineer</p>

        {/* descrição */}
        <p className="desc">
          Construindo e testando interfaces modernas com foco em performance.
        </p>

        {/* botão que rola a página */}
        <button onClick={scroll}>Ver Projetos</button>
      </div>

      {/* CENTRO - sua foto */}
      <div className="center">
        <img src="/me.png" alt="Amaury" />
      </div>

      {/* DIREITA - sobre + redes */}
      <div className="right">
        <h4>Sobre mim</h4>

        <p>
         QA Tester com base em desenvolvimento front-end, focado em qualidade, testes automatizados e melhoria contínua.
        </p>

        <span>REDES SOCIAIS</span>

        {/* redes sociais */}
        <div className="social">
          <a href="https://github.com/amaurybritoo" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>

          <a href="https://linkedin.com/in/amaurybritoo" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>

          <a href="https://instagram.com/amaurybritoo" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
      </div>
    </div>

    </section>
  );
}