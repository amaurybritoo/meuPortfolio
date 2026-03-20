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
        <h1>Amaury</h1>

        {/* cargo */}
        <p className="cargo">Front-end Developer & QA Engineer</p>

        {/* descrição */}
        <p className="desc">
          Construindo interfaces modernas com foco em performance.
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
          Desenvolvedor focado em front-end e qualidade de software.
        </p>

        <span>FOLLOW ME</span>

        {/* redes sociais */}
        <div className="social">
          <FaGithub />
          <FaLinkedin />
          <FaInstagram />
        </div>
      </div>

    </section>
  );
}