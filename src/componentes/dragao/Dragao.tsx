import { useEffect, useRef } from "react";
import type { ConfigDragao } from "../../tipos";
import { ALTURA_DRAGAO, LARGURA_DRAGAO, desenharDragao } from "./desenhar";
import "../../estilos/dragao.css";

interface Props {
  config: ConfigDragao;
  /** "fundo": voa atravessando a tela | "previa": bate as asas parado (usado no admin) */
  modo?: "fundo" | "previa";
}

const VELOCIDADE_BASE = 210; // pixels por segundo
const INTERVALO_QUADROS = 1000 / 30; // o desenho roda a ~30 quadros por segundo (economiza bateria)

interface Voo {
  direcao: 1 | -1;
  inicio: number;
  duracao: number;
  xInicio: number;
  xFim: number;
  yInicio: number;
  yFim: number;
  amplitude: number;
  ondas: number;
  fase: number;
}

const sorteio = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * Dragão voando ao fundo da página.
 * - fica ATRÁS do conteúdo (z-index baixo) e não recebe cliques;
 * - tem pouca opacidade para nunca atrapalhar a leitura;
 * - para quando a aba fica escondida e não aparece para quem pediu "reduzir animações".
 */
export default function Dragao({ config, modo = "fundo" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  // quem pede "reduzir animações" no aparelho não vê o dragão voando (só a prévia do admin ignora isso)
  const reduzirMovimento = modo === "fundo" && typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    configRef.current = config;
    if (canvasRef.current) canvasRef.current.style.opacity = String(config.opacidade);
  }, [config]);

  useEffect(() => {
    if (!config.ativo || reduzirMovimento) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(LARGURA_DRAGAO * dpr);
    canvas.height = Math.round(ALTURA_DRAGAO * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let timer = 0;
    let ultimoDesenho = 0;
    let voo: Voo | null = null;
    let larguraAnterior = window.innerWidth;
    let alturaAnterior = window.innerHeight;
    let direcaoAnterior: 1 | -1 = -1;
    let proximoInicio = performance.now() + 1500; // primeiro voo logo depois de abrir a página

    const iniciarVoo = (agora: number): Voo => {
      const cfg = configRef.current;
      const largura = window.innerWidth;
      const altura = window.innerHeight;
      const base = Math.min(0.9, Math.max(0.42, largura / 1500));
      const escala = base * cfg.tamanho;
      const diagonal = Math.random() < 0.38;
      const direcao: 1 | -1 = diagonal ? (Math.random() < 0.5 ? -1 : 1) : (direcaoAnterior === 1 ? -1 : 1);
      if (!diagonal) direcaoAnterior = direcao;
      const larguraTela = LARGURA_DRAGAO * escala;
      const xInicio = direcao === 1 ? -larguraTela / 2 - 40 : largura + larguraTela / 2 + 40;
      const xFim = xInicio + direcao * (largura + larguraTela + 80);
      const yInicio = altura * (diagonal ? sorteio(0.12, 0.34) : sorteio(0.2, 0.5));
      const yFim = diagonal ? altura * sorteio(0.48, 0.76) : yInicio;
      const distancia = Math.hypot(xFim - xInicio, yFim - yInicio);
      return {
        direcao,
        inicio: agora,
        duracao: (distancia / (VELOCIDADE_BASE * cfg.velocidade)) * 1000,
        xInicio,
        xFim,
        yInicio,
        yFim,
        amplitude: altura * sorteio(0.012, 0.024),
        ondas: sorteio(1.1, 1.7),
        fase: sorteio(0, Math.PI * 2),
      };
    };

    const agendar = (atraso: number) => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = 0;
        raf = requestAnimationFrame(quadro);
      }, Math.max(0, atraso));
    };

    const quadro = (agora: number) => {
      raf = 0;
      if (document.hidden) return;
      // Em celulares a barra do navegador altera innerHeight durante o scroll.
      // Tratar essa mudança como redimensionamento reiniciava o voo e escondia o dragão.
      const alturaAtual = window.innerHeight;
      const larguraAtual = window.innerWidth;
      const mudouOrientacaoOuTamanho =
        Math.abs(larguraAtual - larguraAnterior) > 40 ||
        Math.abs(alturaAtual - alturaAnterior) > Math.max(140, alturaAnterior * 0.22);
      if (modo === "fundo" && mudouOrientacaoOuTamanho) {
        larguraAnterior = larguraAtual;
        alturaAnterior = alturaAtual;
        voo = null;
        canvas.style.visibility = "hidden";
        proximoInicio = agora + 250;
      }
      const cfg = configRef.current;

      if (modo === "previa") {
        if (agora - ultimoDesenho >= INTERVALO_QUADROS) {
          ultimoDesenho = agora;
          desenharDragao(ctx, { cor: cfg.cor, t: (agora / 1000) * (0.8 + 0.4 * cfg.velocidade) });
        }
        raf = requestAnimationFrame(quadro);
        return;
      }

      if (!voo) {
        if (agora < proximoInicio) {
          agendar(proximoInicio - agora);
          return;
        }
        voo = iniciarVoo(agora);
        canvas.style.visibility = "visible";
      }
      const progresso = (agora - voo.inicio) / voo.duracao;
      if (progresso >= 1) {
        voo = null;
        canvas.style.visibility = "hidden";
        const espera = cfg.intervalo * 1000 * sorteio(0.8, 1.25);
        proximoInicio = agora + espera;
        agendar(espera);
        return;
      }

      const suavizado = progresso * progresso * (3 - 2 * progresso);
      const centroX = voo.xInicio + (voo.xFim - voo.xInicio) * progresso;
      const argumento = progresso * Math.PI * 2 * voo.ondas + voo.fase;
      // Alterna travessias niveladas com diagonais em 2D. A escala e a orientação do corpo ficam constantes.
      const centroY = voo.yInicio + (voo.yFim - voo.yInicio) * progresso + voo.amplitude * Math.sin(argumento);

      canvas.style.opacity = String(cfg.opacidade);
      canvas.style.filter = `drop-shadow(0 0 ${Math.round(14 * suavizado)}px ${cfg.cor})`;
      canvas.style.transform = `translate3d(${(centroX - LARGURA_DRAGAO / 2).toFixed(1)}px, ${(centroY - ALTURA_DRAGAO / 2).toFixed(1)}px, 0) scaleX(${voo.direcao}) scale(${Math.min(0.9, Math.max(0.42, window.innerWidth / 1500)) * cfg.tamanho})`;

      if (agora - ultimoDesenho >= INTERVALO_QUADROS) {
        ultimoDesenho = agora;
        desenharDragao(ctx, { cor: cfg.cor, t: ((agora - voo.inicio) / 1000) * (0.8 + 0.4 * cfg.velocidade) });
      }
      raf = requestAnimationFrame(quadro);
    };

    const aoMudarVisibilidade = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        window.clearTimeout(timer);
        timer = 0;
      } else if (!raf && !timer) {
        raf = requestAnimationFrame(quadro);
      }
    };

    canvas.style.visibility = modo === "previa" ? "visible" : "hidden";
    raf = requestAnimationFrame(quadro);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, [config.ativo, modo, reduzirMovimento]);

  if (!config.ativo || reduzirMovimento) return null;
  return (
    <canvas
      ref={canvasRef}
      className={`dragao ${modo === "fundo" ? "dragao-fundo" : "dragao-previa"}`}
      style={{ opacity: config.opacidade }}
      aria-hidden="true"
      data-testid="dragao"
    />
  );
}
