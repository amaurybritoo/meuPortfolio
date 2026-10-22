import { useState } from "react";
import { FaPlay, FaSearchPlus } from "react-icons/fa";
import type { Midia } from "../../tipos";
import Lightbox from "./Lightbox";

export default function GaleriaProjeto({ itens, nome }: { itens: Midia[]; nome: string }) {
  const [aberto, setAberto] = useState<number | null>(null);
  const validos = itens.filter((m) => m.src);
  if (validos.length === 0) return null;

  return (
    <>
      <ul className="galeria-grade">
        {validos.map((midia, i) => (
          <li key={`${midia.src}-${i}`}>
            <button type="button" className="galeria-item" onClick={() => setAberto(i)} aria-label={`Ampliar: ${midia.legenda || `imagem ${i + 1} de ${nome}`}`}>
              {midia.tipo === "video" ? (
                <>
                  <video src={midia.src} muted preload="metadata" playsInline aria-hidden="true" />
                  <span className="galeria-play" aria-hidden="true"><FaPlay /></span>
                </>
              ) : (
                <img src={midia.src} alt="" loading="lazy" decoding="async" />
              )}
              <span className="galeria-lupa" aria-hidden="true"><FaSearchPlus /></span>
              {midia.legenda && <span className="galeria-legenda">{midia.legenda}</span>}
            </button>
          </li>
        ))}
      </ul>
      {aberto !== null && <Lightbox itens={validos} indice={aberto} onMudar={setAberto} onFechar={() => setAberto(null)} />}
    </>
  );
}
