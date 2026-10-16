// Rascunho do admin, último estado publicado e configuração do GitHub (tudo no navegador).

import type { Portfolio } from "../tipos";
import { normalizarPortfolio } from "../data/padrao";

const CHAVE_RASCUNHO = "portfolio:rascunho:v1";
const CHAVE_PUBLICADO = "portfolio:publicado:v1";
const CHAVE_GITHUB = "portfolio:github:v1";
const CHAVE_TOKEN = "portfolio:github-token:v1";
const CHAVE_PREVIEW = "portfolio:preview:v1";

function ler(chave: string, area: Storage = localStorage): unknown {
  try {
    const bruto = area.getItem(chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export function lerRascunho(): Portfolio | null {
  const bruto = ler(CHAVE_RASCUNHO);
  return bruto ? normalizarPortfolio(bruto) : null;
}

/** Retorna false se o navegador recusar (limite de espaço, modo privado...). */
export function salvarRascunho(dados: Portfolio): boolean {
  try {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(dados));
    return true;
  } catch {
    return false;
  }
}

export function limparRascunho(): void {
  try {
    localStorage.removeItem(CHAVE_RASCUNHO);
  } catch {
    /* sem acesso ao armazenamento */
  }
}

export function lerUltimoPublicado(): Portfolio | null {
  const bruto = ler(CHAVE_PUBLICADO);
  return bruto ? normalizarPortfolio(bruto) : null;
}

export function salvarUltimoPublicado(dados: Portfolio): void {
  try {
    localStorage.setItem(CHAVE_PUBLICADO, JSON.stringify(dados));
  } catch {
    /* ignora */
  }
}

export interface ConfigGithub {
  owner: string;
  repo: string;
  branch: string;
  caminhoJson: string;
  pastaUploads: string;
  token: string;
  lembrarToken: boolean;
}

export const GITHUB_PADRAO: ConfigGithub = {
  owner: "amaurybritoo",
  repo: "meuPortfolio",
  branch: "main",
  caminhoJson: "src/data/portfolio.json",
  pastaUploads: "public/uploads",
  token: "",
  lembrarToken: false,
};

export function lerGithub(): ConfigGithub {
  const salvo = ler(CHAVE_GITHUB);
  const o = salvo && typeof salvo === "object" ? (salvo as Record<string, unknown>) : {};
  const str = (v: unknown, padrao: string) => (typeof v === "string" && v.trim() ? v.trim() : padrao);
  const lembrar = o.lembrarToken === true;
  const token = lembrar ? ler(CHAVE_TOKEN) : ler(CHAVE_TOKEN, sessionStorage);
  return {
    owner: str(o.owner, GITHUB_PADRAO.owner),
    repo: str(o.repo, GITHUB_PADRAO.repo),
    branch: str(o.branch, GITHUB_PADRAO.branch),
    caminhoJson: str(o.caminhoJson, GITHUB_PADRAO.caminhoJson),
    pastaUploads: str(o.pastaUploads, GITHUB_PADRAO.pastaUploads),
    token: typeof token === "string" ? token : "",
    lembrarToken: lembrar,
  };
}

export function salvarGithub(cfg: ConfigGithub): void {
  try {
    const { token, ...resto } = cfg;
    localStorage.setItem(CHAVE_GITHUB, JSON.stringify(resto));
    // o token só fica gravado se a pessoa pedir; senão vale apenas enquanto a aba estiver aberta
    localStorage.removeItem(CHAVE_TOKEN);
    sessionStorage.removeItem(CHAVE_TOKEN);
    (cfg.lembrarToken ? localStorage : sessionStorage).setItem(CHAVE_TOKEN, JSON.stringify(token));
  } catch {
    /* ignora */
  }
}

export function esquecerToken(): void {
  try {
    localStorage.removeItem(CHAVE_TOKEN);
    sessionStorage.removeItem(CHAVE_TOKEN);
  } catch {
    /* ignora */
  }
}

/** Modo de pré-visualização do site (usa o rascunho do admin em vez do conteúdo publicado). */
export function detectarPreview(busca: string): boolean {
  try {
    const param = new URLSearchParams(busca).get("preview");
    if (param === "1") sessionStorage.setItem(CHAVE_PREVIEW, "1");
    if (param === "0") sessionStorage.removeItem(CHAVE_PREVIEW);
    return sessionStorage.getItem(CHAVE_PREVIEW) === "1";
  } catch {
    return false;
  }
}

export function sairDoPreview(): void {
  try {
    sessionStorage.removeItem(CHAVE_PREVIEW);
  } catch {
    /* ignora */
  }
}
