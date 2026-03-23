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
        <a href="mailto:amaurypb845@gmail.com" className="contato-card">
          <FaEnvelope />
          <span>Email</span>
          <p>amaurypb845@gmail.com</p>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/5592981737451"
          target="_blank"
          className="contato-card"
        >
          <FaWhatsapp />
          <span>WhatsApp</span>
          <p>(92) 98173-7451</p>
        </a>

      </div>
    </section>
  );
}