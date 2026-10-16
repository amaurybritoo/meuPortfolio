import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent as EventoMouse, PointerEvent as EventoPonteiro } from "react";
import { FaChevronLeft, FaChevronRight, FaSearchMinus, FaSearchPlus, FaTimes } from "react-icons/fa";
import type { Midia } from "../../tipos";
import { limitar } from "../../utilitarios/texto";
import "../../estilos/lightbox.css";

interface Props {
  itens: Midia[];
  indice: number;
  onMudar: (indice: number) => void;
  onFechar: () => void;
}

interface Zoom {
  escala: number;
  x: number;
  y: number;
}

const ESCALA_MAX = 5;
const ZOOM_INICIAL: Zoom = { escala: 1, x: 0, y: 0 };

/** Visualizador de imagens/vídeos em tela cheia: zoom (roda do mouse, pinça, botões), arrastar, setas e Esc. */
export default function Lightbox({ itens, indice, onMudar, onFechar }: Props) {
  const item = itens[indice];
  const [zoom, setZoom] = useState<Zoom>(ZOOM_INICIAL);
  const palco = useRef<HTMLDivElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const ponteiros = useRef(new Map<number, { x: number; y: number }>());
  const gesto = useRef({ distancia: 0, inicioX: 0, inicioY: 0, zoomInicial: ZOOM_INICIAL, moveu: false });
  const limiteZoom = useRef(ESCALA_MAX);
  const ehImagem = item?.tipo === "img";

  const limitarPan = useCallback((z: Zoom): Zoom => {
    const caixa = palco.current?.getBoundingClientRect();
    if (!caixa || z.escala <= 1) return { ...z, x: 0, y: 0 };
    const limiteX = (caixa.width * (z.escala - 1)) / 2;
    const limiteY = (caixa.height * (z.escala - 1)) / 2;
    return { escala: z.escala, x: limitar(z.x, -limiteX, limiteX), y: limitar(z.y, -limiteY, limiteY) };
  }, []);

  const aplicarZoom = useCallback(
    (novaEscala: number, focoX?: number, focoY?: number) => {
      setZoom((atual) => {
        const escala = limitar(novaEscala, 1, limiteZoom.current);
        const caixa = palco.current?.getBoundingClientRect();
        if (!caixa || escala === 1) return ZOOM_INICIAL;
        // mantém o ponto sob o cursor no mesmo lugar enquanto aproxima
        const cx = (focoX ?? caixa.left + caixa.width / 2) - (caixa.left + caixa.width / 2);
        const cy = (focoY ?? caixa.top + caixa.height / 2) - (caixa.top + caixa.height / 2);
        const razao = escala / atual.escala;
        return limitarPan({ escala, x: cx - (cx - atual.x) * razao, y: cy - (cy - atual.y) * razao });
      });
    },
    [limitarPan],
  );

  const ir = useCallback(
    (passo: number) => {
      setZoom(ZOOM_INICIAL);
      onMudar((indice + passo + itens.length) % itens.length);
    },
    [indice, itens.length, onMudar],
  );

  // trava a rolagem da página, foca o botão de fechar e devolve o foco ao fechar
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("lightbox-aberto");
    botaoFechar.current?.focus();
    return () => {
      document.documentElement.classList.remove("lightbox-aberto");
      anterior?.focus?.();
    };
  }, []);

  // teclado
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
      else if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
      else if (e.key === "+" || e.key === "=") aplicarZoom(zoom.escala * 1.4);
      else if (e.key === "-") aplicarZoom(zoom.escala / 1.4);
      else if (e.key === "0") setZoom(ZOOM_INICIAL);
      else if (e.key === "Tab") {
        // mantém o foco dentro do visualizador
        const focaveis = Array.from(document.querySelectorAll<HTMLElement>(".lightbox button:not([disabled])"));
        if (focaveis.length === 0) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aplicarZoom, ir, onFechar, zoom.escala]);

  // roda do mouse (precisa ser um ouvinte "não passivo" para poder impedir a rolagem da página)
  useEffect(() => {
    const el = palco.current;
    if (!el || !ehImagem) return;
    const aoRolar = (e: WheelEvent) => {
      e.preventDefault();
      aplicarZoom(zoom.escala * (e.deltaY < 0 ? 1.18 : 1 / 1.18), e.clientX, e.clientY);
    };
    el.addEventListener("wheel", aoRolar, { passive: false });
    return () => el.removeEventListener("wheel", aoRolar);
  }, [aplicarZoom, ehImagem, zoom.escala]);

  const aoPressionar = (e: EventoPonteiro<HTMLDivElement>) => {
    if (!ehImagem) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesto.current = { distancia: 0, inicioX: e.clientX, inicioY: e.clientY, zoomInicial: zoom, moveu: false };
    if (ponteiros.current.size === 2) {
      const [a, b] = Array.from(ponteiros.current.values());
      gesto.current.distancia = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const aoMover = (e: EventoPonteiro<HTMLDivElement>) => {
    if (!ponteiros.current.has(e.pointerId)) return;
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ponteiros.current.size === 2) {
      // pinça: aproxima/afasta
      const [a, b] = Array.from(ponteiros.current.values());
      const distancia = Math.hypot(a.x - b.x, a.y - b.y);
      if (gesto.current.distancia > 0) aplicarZoom(gesto.current.zoomInicial.escala * (distancia / gesto.current.distancia), (a.x + b.x) / 2, (a.y + b.y) / 2);
      gesto.current.moveu = true;
      return;
    }
    const dx = e.clientX - gesto.current.inicioX;
    const dy = e.clientY - gesto.current.inicioY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) gesto.current.moveu = true;
    if (zoom.escala > 1) {
      const base = gesto.current.zoomInicial;
      setZoom(limitarPan({ escala: zoom.escala, x: base.x + dx, y: base.y + dy }));
    }
  };

  const aoSoltar = (e: EventoPonteiro<HTMLDivElement>) => {
    if (!ponteiros.current.has(e.pointerId)) return;
    const eraUnico = ponteiros.current.size === 1;
    ponteiros.current.delete(e.pointerId);
    if (eraUnico && zoom.escala === 1 && itens.length > 1) {
      const dx = e.clientX - gesto.current.inicioX;
      const dy = e.clientY - gesto.current.inicioY;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) ir(dx < 0 ? 1 : -1); // deslizar troca de imagem
    }
    gesto.current.zoomInicial = zoom;
  };

  const aoDarDuploClique = (e: EventoMouse<HTMLDivElement>) => {
    if (!ehImagem) return;
    if (zoom.escala > 1) setZoom(ZOOM_INICIAL);
    else aplicarZoom(2.6, e.clientX, e.clientY);
  };

  if (!item) return null;

  return createPortal((
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.legenda || "Galeria de imagens"}>
      <div className="lightbox-fundo" onClick={onFechar} aria-hidden="true" />

      <div className="lightbox-topo">
        <span className="lightbox-contador" aria-live="polite">{indice + 1} / {itens.length}</span>
        {ehImagem && (
          <div className="lightbox-zoom" role="group" aria-label="Zoom">
            <button type="button" onClick={() => aplicarZoom(zoom.escala / 1.4)} aria-label="Diminuir zoom" disabled={zoom.escala <= 1}><FaSearchMinus aria-hidden="true" /></button>
            <button type="button" onClick={() => setZoom(ZOOM_INICIAL)} aria-label="Tamanho original" className="lightbox-escala" disabled={zoom.escala === 1}>{Math.round(zoom.escala * 100)}%</button>
            <button type="button" onClick={() => aplicarZoom(zoom.escala * 1.4)} aria-label="Aumentar zoom" disabled={zoom.escala >= limiteZoom.current}><FaSearchPlus aria-hidden="true" /></button>
          </div>
        )}
        <button ref={botaoFechar} type="button" className="lightbox-fechar" onClick={onFechar} aria-label="Fechar galeria"><FaTimes aria-hidden="true" /></button>
      </div>

      {itens.length > 1 && (
        <>
          <button type="button" className="lightbox-seta lightbox-seta-esq" onClick={() => ir(-1)} aria-label="Imagem anterior"><FaChevronLeft aria-hidden="true" /></button>
          <button type="button" className="lightbox-seta lightbox-seta-dir" onClick={() => ir(1)} aria-label="Próxima imagem"><FaChevronRight aria-hidden="true" /></button>
        </>
      )}

      <div
        ref={palco}
        className={`lightbox-palco ${ehImagem ? "zoomavel" : ""} ${zoom.escala > 1 ? "ampliado" : ""}`}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onDoubleClick={aoDarDuploClique}
      >
        {ehImagem ? (
          <img
            key={item.src}
            src={item.src}
            alt={item.legenda || "Imagem do projeto"}
            draggable={false}
            onLoad={(evento) => {
              const imagem = evento.currentTarget;
              const fatorLargura = imagem.naturalWidth / imagem.offsetWidth;
              const fatorAltura = imagem.naturalHeight / imagem.offsetHeight;
              limiteZoom.current = Math.min(ESCALA_MAX, Math.max(1, Math.min(fatorLargura, fatorAltura)));
            }}
            style={{ transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.escala})` }}
          />
        ) : (
          <video key={item.src} src={item.src} controls autoPlay playsInline />
        )}
      </div>

      {item.legenda && <p className="lightbox-legenda">{item.legenda}</p>}
    </div>
  ), document.body);
}
