// Redimensiona e comprime imagens enviadas no admin (WebP), para o site continuar leve.

export interface OpcoesImagem {
  maxLado?: number;
  qualidade?: number;
}

function lerComoDataUrl(arquivo: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    leitor.readAsDataURL(arquivo);
  });
}

function carregarImagem(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
    img.src = url;
  });
}

export async function comprimirImagem(arquivo: File, opcoes: OpcoesImagem = {}): Promise<string> {
  const { maxLado = 1600, qualidade = 0.84 } = opcoes;
  if (!arquivo.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem.");
  const original = await lerComoDataUrl(arquivo);
  // SVG e GIF animado ficam como estão
  if (arquivo.type === "image/svg+xml" || arquivo.type === "image/gif") return original;

  const img = await carregarImagem(original);
  const escala = Math.min(1, maxLado / Math.max(img.naturalWidth, img.naturalHeight));
  const largura = Math.max(1, Math.round(img.naturalWidth * escala));
  const altura = Math.max(1, Math.round(img.naturalHeight * escala));
  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, largura, altura);

  let saida = canvas.toDataURL("image/webp", qualidade);
  if (!saida.startsWith("data:image/webp")) {
    // navegador sem suporte a WebP: usa JPEG (ou PNG quando a imagem tem transparência)
    saida = arquivo.type === "image/png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", qualidade);
  }
  // se a imagem foi reduzida, usa sempre a versão reduzida; senão só troca se ficar menor
  return escala < 1 || saida.length < original.length ? saida : original;
}

export function ehDataUrl(valor: string): boolean {
  return valor.startsWith("data:");
}

export function tamanhoAproximadoKb(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4 / 1024);
}
