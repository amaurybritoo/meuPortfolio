import "../estilos/rodape.css";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Rodape() {
  return (
    <footer id="contato">
      <div className="rodape-container">
        
        <div className="rodape-top">
          <div>
            <h3>Amaury Brito</h3>
            <p>Front-end Developer & QA Engineer</p>
          </div>

        {/* redes sociais */}
        <div className="rodape-social">

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

        <div className="linha"></div>

        <div className="rodape-bottom">
          <p>© 2026 Amaury. Todos os direitos reservados.</p>
          <span>Feito com código, café com leite e visão ☕</span>
        </div>

      </div>
    </footer>
  );
}