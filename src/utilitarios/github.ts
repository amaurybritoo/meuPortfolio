// Publica o portfólio direto no repositório do GitHub (sem servidor).
// O admin envia os arquivos pela API do GitHub; a Vercel percebe o commit e atualiza o site sozinha.

import type { Portfolio } from "../tipos";
import type { ConfigGithub } from "./armazenamento";
import { ehDataUrl } from "./imagem";

const API = "https://api.github.com";

export class ErroPublicacao extends Error {}

function cabecalhos(token: string): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

const codificarCaminho = (caminho: string): string =>
  caminho.split("/").filter(Boolean).map(encodeURIComponent).join("/");

function mensagemDeErro(status: number, corpo: unknown): string {
  const detalhe = corpo && typeof corpo === "object" && "message" in corpo ? String((corpo as { message: unknown }).message) : "";
  if (status === 401) return "Token inválido ou expirado (erro 401). Gere um novo token no GitHub.";
  if (status === 403) return `O token não tem permissão de escrita neste repositório (erro 403). ${detalhe}`.trim();
  if (status === 404) return "Repositório, branch ou arquivo não encontrado (erro 404). Confira usuário, repositório e branch.";
  return `O GitHub respondeu com erro ${status}. ${detalhe}`.trim();
}

async function chamar(cfg: ConfigGithub, caminho: string, init: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(`${API}${caminho}`, { ...init, headers: { ...cabecalhos(cfg.token), ...(init.headers as Record<string, string> | undefined) } });
  } catch {
    throw new ErroPublicacao("Sem conexão com o GitHub. Verifique a internet e tente de novo.");
  }
}

async function lerJson(resposta: Response): Promise<unknown> {
  try {
    return await resposta.json();
  } catch {
    return null;
  }
}

export function validarConfig(cfg: ConfigGithub): string | null {
  if (!cfg.owner.trim() || !cfg.repo.trim()) return "Informe o usuário e o nome do repositório.";
  if (!cfg.token.trim()) return "Informe o token de acesso do GitHub.";
  if (!cfg.caminhoJson.trim()) return "Informe o caminho do arquivo JSON.";
  return null;
}

export async function testarConexao(cfg: ConfigGithub): Promise<string> {
  const erro = validarConfig(cfg);
  if (erro) throw new ErroPublicacao(erro);
  const resposta = await chamar(cfg, `/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}`);
  const corpo = await lerJson(resposta);
  if (!resposta.ok) throw new ErroPublicacao(mensagemDeErro(resposta.status, corpo));
  const dados = (corpo ?? {}) as { full_name?: string; permissions?: { push?: boolean } };
  if (dados.permissions && dados.permissions.push === false) {
    throw new ErroPublicacao("Conectou, mas o token só tem permissão de leitura. Ele precisa de 'Contents: Read and write'.");
  }
  return `Conectado a ${dados.full_name ?? `${cfg.owner}/${cfg.repo}`}.`;
}

// ---------- imagens enviadas pelo admin (data URLs) ----------

interface Referencia {
  ler: () => string;
  escrever: (valor: string) => void;
}

function referencia<T extends object>(obj: T, chave: keyof T): Referencia {
  return {
    ler: () => String(obj[chave] ?? ""),
    escrever: (valor) => {
      (obj as Record<keyof T, unknown>)[chave] = valor;
    },
  };
}

export function coletarImagens(dados: Portfolio): Referencia[] {
  const refs: Referencia[] = [referencia(dados.perfil, "foto"), referencia(dados.perfil, "logo"), referencia(dados.perfil, "curriculo")];
  dados.projetos.forEach((p) => {
    refs.push(referencia(p, "capa"), referencia(p, "banner"));
    p.prints.forEach((m) => {
      if (m.tipo === "img") refs.push(referencia(m, "src"));
    });
    p.testes.forEach((t) => refs.push(referencia(t, "imagem")));
  });
  return refs.filter((r) => ehDataUrl(r.ler()));
}

export function contarImagensPendentes(dados: Portfolio): number {
  return coletarImagens(dados).length;
}

function dataUrlParaBytes(dataUrl: string): { bytes: Uint8Array; mime: string; base64: string } {
  const partes = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(dataUrl);
  if (!partes) throw new ErroPublicacao("Imagem em formato inválido.");
  const mime = partes[1];
  const base64 = partes[2] ? partes[3] : btoa(decodeURIComponent(partes[3]));
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return { bytes, mime, base64 };
}

const EXTENSOES: Record<string, string> = {
  "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/svg+xml": "svg", "application/pdf": "pdf",
};

async function hashCurto(bytes: Uint8Array): Promise<string> {
  const copia = new Uint8Array(bytes).buffer;
  const digest = await crypto.subtle.digest("SHA-1", copia);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 14);
}

function paraBase64(texto: string): string {
  const bytes = new TextEncoder().encode(texto);
  let binario = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binario);
}

export interface ResultadoPublicacao {
  dados: Portfolio;
  imagensEnviadas: number;
  url: string;
}

export async function publicarNoGithub(dados: Portfolio, cfg: ConfigGithub, avisar: (mensagem: string) => void): Promise<ResultadoPublicacao> {
  const erro = validarConfig(cfg);
  if (erro) throw new ErroPublicacao(erro);
  const base = `/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents`;
  const copia = structuredClone(dados);
  const refs = coletarImagens(copia);
  const pasta = cfg.pastaUploads.replace(/^\/+|\/+$/g, "");
  const urlPublica = pasta.startsWith("public/") ? `/${pasta.slice("public/".length)}` : `/${pasta}`;

  // 1) imagens novas viram arquivos do repositório (nome = impressão digital do conteúdo)
  let enviadas = 0;
  const jaEnviadas = new Map<string, string>();
  for (const ref of refs) {
    const original = ref.ler();
    const repetida = jaEnviadas.get(original);
    if (repetida) {
      ref.escrever(repetida);
      continue;
    }
    const { bytes, mime, base64 } = dataUrlParaBytes(original);
    const nome = `${await hashCurto(bytes)}.${EXTENSOES[mime] ?? "bin"}`;
    avisar(`Enviando arquivo ${enviadas + 1} de ${new Set(refs.map((r) => r.ler())).size}: ${nome}`);
    const resposta = await chamar(cfg, `${base}/${codificarCaminho(`${pasta}/${nome}`)}`, {
      method: "PUT",
      body: JSON.stringify({ message: `admin: adiciona imagem ${nome}`, content: base64, branch: cfg.branch }),
    });
    // 422 = o arquivo já existe com o mesmo conteúdo (o nome é a impressão digital): tudo certo
    if (!resposta.ok && resposta.status !== 422) throw new ErroPublicacao(mensagemDeErro(resposta.status, await lerJson(resposta)));
    const publica = `${urlPublica}/${nome}`;
    jaEnviadas.set(original, publica);
    ref.escrever(publica);
    enviadas++;
  }

  // 2) arquivo JSON com todo o conteúdo
  avisar("Gravando portfolio.json…");
  const caminhoJson = codificarCaminho(cfg.caminhoJson);
  let sha: string | undefined;
  const existente = await chamar(cfg, `${base}/${caminhoJson}?ref=${encodeURIComponent(cfg.branch)}`);
  if (existente.ok) {
    const info = (await lerJson(existente)) as { sha?: string } | null;
    sha = info?.sha;
  } else if (existente.status !== 404) {
    throw new ErroPublicacao(mensagemDeErro(existente.status, await lerJson(existente)));
  }
  const resposta = await chamar(cfg, `${base}/${caminhoJson}`, {
    method: "PUT",
    body: JSON.stringify({
      message: "admin: atualiza o conteúdo do portfólio",
      content: paraBase64(`${JSON.stringify(copia, null, 2)}\n`),
      branch: cfg.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  const corpo = await lerJson(resposta);
  if (!resposta.ok) throw new ErroPublicacao(mensagemDeErro(resposta.status, corpo));
  const url = (corpo as { commit?: { html_url?: string } } | null)?.commit?.html_url ?? `https://github.com/${cfg.owner}/${cfg.repo}`;
  return { dados: copia, imagensEnviadas: enviadas, url };
}
