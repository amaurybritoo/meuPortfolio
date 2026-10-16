// Pequenas funções de texto usadas no site e no admin.

export function slugify(valor: string): string {
  const base = valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "projeto";
}

/** Gera um endereço único: se já existir, acrescenta -2, -3... */
export function slugUnico(base: string, usados: Iterable<string>): string {
  const existentes = new Set(usados);
  const inicio = slugify(base);
  let slug = inicio;
  let n = 2;
  while (existentes.has(slug)) slug = `${inicio}-${n++}`;
  return slug;
}

export function gerarId(prefixo = "id"): string {
  const aleatorio = Math.random().toString(36).slice(2, 8);
  const tempo = Date.now().toString(36).slice(-4);
  return `${prefixo}-${aleatorio}${tempo}`;
}

export function paragrafos(texto: string): string[] {
  return texto
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function hexParaRgb(hex: string): string {
  const limpo = hex.replace("#", "");
  const completo = limpo.length === 3 ? limpo.split("").map((c) => c + c).join("") : limpo;
  const n = parseInt(completo, 16);
  if (Number.isNaN(n) || completo.length !== 6) return "168, 85, 247";
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function ehLinkExterno(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

export function limitar(valor: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, valor));
}
