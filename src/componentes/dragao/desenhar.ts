// Desenho do dragão em canvas (vista lateral, voando para a direita).
// Tudo é calculado a partir do tempo (t, em segundos): a cauda ondula, o corpo sobe e desce
// junto com as batidas de asa e a mandíbula abre e fecha devagar.

export const LARGURA_DRAGAO = 640;
export const ALTURA_DRAGAO = 430;

type Ponto = [number, number];

// Pontos-guia da coluna do dragão (da ponta da cauda até a cabeça).
const COLUNA: Ponto[] = [
  [34, 372], [104, 344], [178, 308], [252, 282], [326, 268],
  [392, 260], [444, 244], [488, 210], [518, 178], [544, 162],
];

// Espessura (meia-largura) do corpo ao longo da coluna: 0 = cauda, 1 = cabeça.
const ESPESSURA: Array<[number, number]> = [
  [0, 1.5], [0.12, 5], [0.3, 11], [0.5, 17], [0.62, 19], [0.78, 12], [0.9, 8.5], [1, 7.5],
];

// Poses da asa em relação ao ombro: "alta" (início da batida) e "baixa" (fim da batida).
interface PoseAsa {
  pulso: Ponto;
  pontas: Ponto[];
  base: Ponto; // onde a membrana encosta no corpo, perto do quadril
}
const ASA_ALTA: PoseAsa = {
  pulso: [4, -112],
  pontas: [[132, -176], [78, -226], [-10, -226], [-92, -174]],
  base: [-128, -6],
};
const ASA_BAIXA: PoseAsa = {
  pulso: [38, -60],
  pontas: [[140, 24], [80, 92], [4, 112], [-66, 88]],
  base: [-140, -6],
};

const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const suave = (k: number): number => k * k * (3 - 2 * k);

function espessuraEm(u: number): number {
  for (let i = 1; i < ESPESSURA.length; i++) {
    const [u1, e1] = ESPESSURA[i];
    if (u <= u1) {
      const [u0, e0] = ESPESSURA[i - 1];
      return lerp(e0, e1, (u - u0) / (u1 - u0 || 1));
    }
  }
  return ESPESSURA[ESPESSURA.length - 1][1];
}

/** Curva suave (Catmull-Rom) passando pelos pontos-guia. */
function curva(pontos: Ponto[], amostras: number): Ponto[] {
  const saida: Ponto[] = [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const p0 = pontos[Math.max(0, i - 1)];
    const p1 = pontos[i];
    const p2 = pontos[i + 1];
    const p3 = pontos[Math.min(pontos.length - 1, i + 2)];
    for (let s = 0; s < amostras; s++) {
      const k = s / amostras;
      const k2 = k * k;
      const k3 = k2 * k;
      saida.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * k + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * k2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * k3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * k + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * k2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * k3),
      ]);
    }
  }
  saida.push(pontos[pontos.length - 1]);
  return saida;
}

interface Corpo {
  centro: Ponto[];
  cima: Ponto[];
  baixo: Ponto[];
  normal: Ponto[]; // normal apontando para "cima" do dragão
}

function montarCorpo(t: number): Corpo {
  const batida = 2 * Math.PI * 1.35 * t; // ritmo das asas
  const onda = 2 * Math.PI * 0.95 * t; // ritmo da cauda
  const pontos = COLUNA.map(([x, y], i): Ponto => {
    const u = i / (COLUNA.length - 1);
    const cauda = 24 * Math.pow(1 - u, 1.5) * Math.sin(onda - 5.2 * u);
    const corpo = 8 * Math.sin(batida - 0.9) * Math.sin(Math.PI * Math.min(1, u * 1.15));
    const pescoco = u > 0.7 ? 4 * Math.sin(batida + 0.6) * (u - 0.7) / 0.3 : 0;
    return [x, y + cauda + corpo + pescoco];
  });
  const centro = curva(pontos, 7);
  const cima: Ponto[] = [];
  const baixo: Ponto[] = [];
  const normal: Ponto[] = [];
  centro.forEach((p, i) => {
    const a = centro[Math.max(0, i - 1)];
    const b = centro[Math.min(centro.length - 1, i + 1)];
    let tx = b[0] - a[0];
    let ty = b[1] - a[1];
    const tam = Math.hypot(tx, ty) || 1;
    tx /= tam;
    ty /= tam;
    const nx = ty; // normal para "cima" (y negativo)
    const ny = -tx;
    const e = espessuraEm(i / (centro.length - 1));
    cima.push([p[0] + nx * e, p[1] + ny * e]);
    baixo.push([p[0] - nx * e, p[1] - ny * e]);
    normal.push([nx, ny]);
  });
  return { centro, cima, baixo, normal };
}

function caminhoSuave(ctx: CanvasRenderingContext2D, pontos: Ponto[], reiniciar: boolean): void {
  if (reiniciar) ctx.moveTo(pontos[0][0], pontos[0][1]);
  else ctx.lineTo(pontos[0][0], pontos[0][1]);
  for (let i = 1; i < pontos.length - 1; i++) {
    const mx = (pontos[i][0] + pontos[i + 1][0]) / 2;
    const my = (pontos[i][1] + pontos[i + 1][1]) / 2;
    ctx.quadraticCurveTo(pontos[i][0], pontos[i][1], mx, my);
  }
  const ultimo = pontos[pontos.length - 1];
  ctx.lineTo(ultimo[0], ultimo[1]);
}

interface Estilo {
  traco: string;
  brilho: string;
  preenchimento: string;
  membrana: string;
}

function desenharAsa(ctx: CanvasRenderingContext2D, ombro: Ponto, fase: number, escala: number, estilo: Estilo, alpha: number): void {
  const k = suave(fase);
  const pulso: Ponto = [lerp(ASA_ALTA.pulso[0], ASA_BAIXA.pulso[0], k) * escala, lerp(ASA_ALTA.pulso[1], ASA_BAIXA.pulso[1], k) * escala];
  const pontas = ASA_ALTA.pontas.map((p, i): Ponto => [
    lerp(p[0], ASA_BAIXA.pontas[i][0], k) * escala,
    lerp(p[1], ASA_BAIXA.pontas[i][1], k) * escala,
  ]);
  const base: Ponto = [ASA_ALTA.base[0] * escala, ASA_ALTA.base[1] * escala];

  ctx.save();
  ctx.translate(ombro[0], ombro[1]);
  ctx.globalAlpha = alpha;

  // membrana (com as bordas "recortadas" entre um dedo e outro)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(pulso[0], pulso[1]);
  ctx.lineTo(pontas[0][0], pontas[0][1]);
  const sequencia: Ponto[] = [...pontas, base];
  for (let i = 0; i < sequencia.length - 1; i++) {
    const a = sequencia[i];
    const b = sequencia[i + 1];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const puxar = i === sequencia.length - 2 ? 0.48 : 0.28; // borda de trás mais "cavada"
    ctx.quadraticCurveTo(lerp(mx, pulso[0], puxar), lerp(my, pulso[1], puxar), b[0], b[1]);
  }
  ctx.closePath();
  const gradiente = ctx.createLinearGradient(0, pulso[1], 0, base[1] + 40);
  gradiente.addColorStop(0, estilo.membrana);
  gradiente.addColorStop(1, "rgba(30, 10, 60, 0.18)");
  ctx.fillStyle = gradiente;
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = estilo.traco;
  ctx.shadowColor = estilo.brilho;
  ctx.shadowBlur = 10;
  ctx.stroke();

  // ossos: braço e dedos
  ctx.shadowBlur = 6;
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(pulso[0], pulso[1]);
  ctx.stroke();
  ctx.lineWidth = 2.4;
  pontas.forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(pulso[0], pulso[1]);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
  });
  // garra no pulso
  ctx.beginPath();
  ctx.arc(pulso[0], pulso[1], 3.2, 0, Math.PI * 2);
  ctx.fillStyle = estilo.traco;
  ctx.fill();
  ctx.restore();
}

function desenharPerna(ctx: CanvasRenderingContext2D, origem: Ponto, dx: number, estilo: Estilo, escala: number): void {
  const joelho: Ponto = [origem[0] + dx * 0.9, origem[1] + 20 * escala];
  const pe: Ponto = [origem[0] + dx * 0.25, origem[1] + 40 * escala];
  ctx.beginPath();
  ctx.moveTo(origem[0], origem[1]);
  ctx.lineTo(joelho[0], joelho[1]);
  ctx.lineTo(pe[0], pe[1]);
  ctx.lineWidth = 5 * escala;
  ctx.strokeStyle = estilo.traco;
  ctx.stroke();
  ctx.lineWidth = 1.8;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(pe[0], pe[1]);
    ctx.lineTo(pe[0] + 7 + i * 3, pe[1] + 9 + Math.abs(i) * 1.5);
    ctx.stroke();
  }
}

function desenharCabeca(ctx: CanvasRenderingContext2D, base: Ponto, angulo: number, t: number, estilo: Estilo): void {
  ctx.save();
  ctx.translate(base[0], base[1]);
  ctx.rotate(angulo);
  const boca = 0.1 + 0.06 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.45 * t));

  // chifres (atrás da cabeça)
  ctx.lineCap = "round";
  ctx.strokeStyle = estilo.traco;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-2, -12);
  ctx.quadraticCurveTo(-30, -34, -62, -26);
  ctx.stroke();
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(8, -15);
  ctx.quadraticCurveTo(-8, -42, -34, -46);
  ctx.stroke();

  // franja de espinhos no pescoço
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-8 - i * 7, -6 + i * 1.5);
    ctx.lineTo(-22 - i * 8, -18 + i * 3);
    ctx.stroke();
  }

  // mandíbula inferior
  ctx.save();
  ctx.translate(10, 8);
  ctx.rotate(boca);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(26, 3);
  ctx.lineTo(42, 2);
  ctx.lineTo(40, 7);
  ctx.lineTo(24, 11);
  ctx.lineTo(0, 9);
  ctx.closePath();
  ctx.fillStyle = estilo.preenchimento;
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();

  // crânio e focinho
  ctx.beginPath();
  ctx.moveTo(-16, -6);
  ctx.quadraticCurveTo(-8, -17, 12, -16);
  ctx.quadraticCurveTo(28, -14, 34, -9);
  ctx.lineTo(52, -6);
  ctx.quadraticCurveTo(62, -2, 57, 4);
  ctx.lineTo(40, 6);
  ctx.lineTo(24, 7);
  ctx.lineTo(10, 9);
  ctx.quadraticCurveTo(-8, 10, -16, 3);
  ctx.closePath();
  ctx.fillStyle = estilo.preenchimento;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();

  // olho brilhante e narina
  ctx.shadowBlur = 14;
  ctx.shadowColor = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(21, -4.5, 3.6, 2.2, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(53, -1, 1.4, 0, Math.PI * 2);
  ctx.fillStyle = estilo.traco;
  ctx.fill();
  ctx.restore();
}

export interface OpcoesDesenho {
  cor: string;
  t: number;
}

/** Desenha um quadro do dragão no canvas (use um canvas de LARGURA_DRAGAO x ALTURA_DRAGAO unidades). */
export function desenharDragao(ctx: CanvasRenderingContext2D, opcoes: OpcoesDesenho): void {
  const { cor, t } = opcoes;
  const estilo: Estilo = {
    traco: cor,
    brilho: cor,
    preenchimento: "rgba(24, 8, 48, 0.92)",
    membrana: "rgba(168, 85, 247, 0.42)",
  };
  ctx.clearRect(0, 0, LARGURA_DRAGAO, ALTURA_DRAGAO);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const corpo = montarCorpo(t);
  const n = corpo.centro.length;
  const fase = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.35 * t);
  const indiceOmbro = Math.round(n * 0.62);
  const ombro: Ponto = [corpo.cima[indiceOmbro][0], corpo.cima[indiceOmbro][1] + 3];

  // asa do outro lado (mais ao fundo, menor e mais apagada)
  desenharAsa(ctx, [ombro[0] - 26, ombro[1] - 4], Math.max(0, Math.min(1, fase - 0.12)), 0.84, estilo, 0.5);

  // pernas
  ctx.shadowColor = estilo.brilho;
  ctx.shadowBlur = 6;
  const quadril = corpo.baixo[Math.round(n * 0.34)];
  const peito = corpo.baixo[Math.round(n * 0.62)];
  desenharPerna(ctx, [quadril[0], quadril[1] - 2], -12, estilo, 1);
  desenharPerna(ctx, [peito[0], peito[1] - 2], 10, estilo, 0.9);

  // corpo
  ctx.beginPath();
  caminhoSuave(ctx, corpo.cima, true);
  const ultimoBaixo = [...corpo.baixo].reverse();
  caminhoSuave(ctx, ultimoBaixo, false);
  ctx.closePath();
  const gradienteCorpo = ctx.createLinearGradient(0, 150, 0, 380);
  gradienteCorpo.addColorStop(0, "rgba(46, 16, 86, 0.95)");
  gradienteCorpo.addColorStop(1, "rgba(18, 6, 38, 0.95)");
  ctx.fillStyle = gradienteCorpo;
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = estilo.traco;
  ctx.shadowBlur = 12;
  ctx.stroke();

  // espinhos ao longo do dorso
  ctx.lineWidth = 2;
  ctx.shadowBlur = 6;
  for (let i = Math.round(n * 0.14); i < n * 0.88; i += 4) {
    const u = i / (n - 1);
    const altura = 5 + 8 * Math.sin(Math.PI * Math.min(1, (u - 0.1) / 0.8));
    const base = corpo.cima[i];
    const nm = corpo.normal[i];
    ctx.beginPath();
    ctx.moveTo(base[0] - 3, base[1]);
    ctx.lineTo(base[0] + nm[0] * altura - 5, base[1] + nm[1] * altura);
    ctx.lineTo(base[0] + 3, base[1]);
    ctx.stroke();
  }

  // ponta da cauda em forma de lança
  const ponta = corpo.centro[0];
  const seguinte = corpo.centro[3];
  const ang = Math.atan2(seguinte[1] - ponta[1], seguinte[0] - ponta[0]) + Math.PI;
  ctx.save();
  ctx.translate(ponta[0], ponta[1]);
  ctx.rotate(ang);
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(-6, -10);
  ctx.lineTo(-22, 0);
  ctx.lineTo(-6, 10);
  ctx.closePath();
  ctx.fillStyle = estilo.preenchimento;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // asa de frente
  desenharAsa(ctx, ombro, fase, 1, estilo, 1);

  // cabeça
  const topo = corpo.centro[n - 1];
  const antes = corpo.centro[n - 6];
  const angPescoco = Math.atan2(topo[1] - antes[1], topo[0] - antes[0]);
  desenharCabeca(ctx, topo, angPescoco * 0.3 + 0.12, t, estilo);
  ctx.shadowBlur = 0;
}
