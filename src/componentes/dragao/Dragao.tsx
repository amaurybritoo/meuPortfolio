import { useEffect, useRef } from "react";
import type { ConfigDragao } from "../../tipos";
import { ALTURA_DRAGAO, LARGURA_DRAGAO, desenharDragao } from "./desenhar";
import "../../estilos/dragao.css";

interface Props {
  config: ConfigDragao;
  /** "fundo": voa atravessando a tela | "previa": bate as asas parado (usado no admin) */
  modo?: "fundo" | "previa";
}

const VELOCIDADE_BASE = 95; // pixels por segundo
const INTERVALO_QUADROS = 1000 / 30; // o desenho roda a ~30 quadros por segundo (economiza bateria)

interface Voo {
  direcao: 1 | -1;
  inicio: number;
  duracao: number;
  centroY: number;
  amplitude: number;
  ondas: number;
  fase: number;
  escala: number;
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
    const canvas = canvasRef.current;
    if (!canvas || !config.ativo || reduzirMovimento) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(LARGURA_DRAGAO * dpr);
    canvas.height = Math.round(ALTURA_DRAGAO * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let ultimoDesenho = 0;
    let voo: Voo | null = null;
    let direcaoAnterior: 1 | -1 = -1;
    let proximoInicio = performance.now() + 1500; // primeiro voo logo depois de abrir a página

    const iniciarVoo = (agora: number): Voo => {
      const cfg = configRef.current;
      const largura = window.innerWidth;
      const altura = window.innerHeight;
      const base = Math.min(0.9, Math.max(0.42, largura / 1500));
      const escala = base * cfg.tamanho * sorteio(0.88, 1.1);
      const larguraTela = LARGURA_DRAGAO * escala;
      const direcao: 1 | -1 = direcaoAnterior === 1 ? -1 : 1; // alterna: ida e volta
      direcaoAnterior = direcao;
      const percurso = largura + larguraTela + 80;
      return {
        direcao,
        inicio: agora,
        duracao: (percurso / (VELOCIDADE_BASE * cfg.velocidade)) * 1000,
        centroY: altura * sorteio(0.18, 0.66),
        amplitude: altura * sorteio(0.04, 0.09),
        ondas: sorteio(1.1, 2),
        fase: sorteio(0, Math.PI * 2),
        escala,
      };
    };

    const quadro = (agora: number) => {
      raf = requestAnimationFrame(quadro);
      if (document.hidden) return;
      const cfg = configRef.current;

      if (modo === "previa") {
        if (agora - ultimoDesenho >= INTERVALO_QUADROS) {
          ultimoDesenho = agora;
          desenharDragao(ctx, { cor: cfg.cor, t: (agora / 1000) * (0.8 + 0.4 * cfg.velocidade) });
        }
        return;
      }

      if (!voo) {
        if (agora < proximoInicio) return;
        voo = iniciarVoo(agora);
        canvas.style.visibility = "visible";
      }
      const progresso = (agora - voo.inicio) / voo.duracao;
      if (progresso >= 1) {
        voo = null;
        canvas.style.visibility = "hidden";
        proximoInicio = agora + cfg.intervalo * 1000 * sorteio(0.8, 1.25);
        return;
      }

      const largura = window.innerWidth;
      const larguraTela = LARGURA_DRAGAO * voo.escala;
      const percurso = largura + larguraTela + 80;
      const xInicial = voo.direcao === 1 ? -larguraTela / 2 - 40 : largura + larguraTela / 2 + 40;
      const centroX = xInicial + voo.direcao * percurso * progresso;
      const argumento = progresso * Math.PI * 2 * voo.ondas + voo.fase;
      const centroY = voo.centroY + voo.amplitude * Math.sin(argumento);
      // inclina o dragão para onde ele está subindo/descendo
      const subida = voo.amplitude * Math.cos(argumento) * Math.PI * 2 * voo.ondas;
      const angulo = voo.direcao * Math.atan2(subida, percurso) * 3;

      canvas.style.transform = `translate3d(${(centroX - LARGURA_DRAGAO / 2).toFixed(1)}px, ${(centroY - ALTURA_DRAGAO / 2).toFixed(1)}px, 0) rotate(${angulo.toFixed(3)}rad) scale(${voo.direcao * voo.escala}, ${voo.escala})`;

      if (agora - ultimoDesenho >= INTERVALO_QUADROS) {
        ultimoDesenho = agora;
        desenharDragao(ctx, { cor: cfg.cor, t: ((agora - voo.inicio) / 1000) * (0.8 + 0.4 * cfg.velocidade) });
      }
    };

    canvas.style.visibility = modo === "previa" ? "visible" : "hidden";
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [config.ativo, modo, reduzirMovimento]);

  if (!config.ativo || reduzirMovimento) return null;
  return (
    <canvas
      ref={canvasRef}
      className={modo === "fundo" ? "dragao dragao-fundo" : "dragao dragao-previa"}
      style={{ opacity: config.opacidade }}
      aria-hidden="true"
      data-testid="dragao"
    />
  );
}
