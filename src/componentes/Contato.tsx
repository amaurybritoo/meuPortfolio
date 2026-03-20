import "../estilos/contato.css";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function Contato() {
  return (
    <section id="contato" className="contato">
      <h2>Contato</h2>

      <p className="contato-desc">
        Bora trabalhar juntos? Me chama 👇
      </p>

      <div className="contato-cards">

        {/* EMAIL */}
        <a href="mailto:seuemail@email.com" className="contato-card">
          <FaEnvelope />
          <span>Email</span>
          <p>seuemail@email.com</p>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/5592999999999"
          target="_blank"
          className="contato-card"
        >
          <FaWhatsapp />
          <span>WhatsApp</span>
          <p>(92) 99999-9999</p>
        </a>

      </div>
    </section>
  );
}