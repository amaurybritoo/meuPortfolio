import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function BotaoTopo() {
  const [visivel, setVisivel] = useState(() => window.scrollY > 700);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 700);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const subir = () => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Além de voltar ao topo da página, reinicia a lista horizontal de projetos.
    const projetos = document.querySelector<HTMLElement>(".projetos-grade");
    projetos?.scrollTo({ left: 0, behavior: reduzir ? "auto" : "smooth" });
    window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
  };

  return (
    <button type="button" className={`botao-topo ${visivel ? "visivel" : ""}`} onClick={subir} aria-label="Voltar ao topo" tabIndex={visivel ? 0 : -1}>
      <FaChevronUp aria-hidden="true" />
    </button>
  );
}
