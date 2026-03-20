import "../estilos/rodape.css";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Rodape() {
  return (
    <footer id="contato">
      <div className="rodape-container">
        
        <div className="rodape-top">
          <div>
            <h3>Amaury</h3>
            <p>Front-end Developer & QA Engineer</p>
          </div>

          <div className="rodape-social">
            <FaGithub />
            <FaLinkedin />
            <FaInstagram />
          </div>
        </div>

        <div className="linha"></div>

        <div className="rodape-bottom">
          <p>© 2026 Amaury. Todos os direitos reservados.</p>
          <span>Feito com código, café e visão ☕</span>
        </div>

      </div>
    </footer>
  );
}