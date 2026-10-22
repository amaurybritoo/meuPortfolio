// Rascunho do admin, última versão salva e prévia local.

import type { Portfolio } from "../tipos";
import { normalizarPortfolio } from "../data/padrao";

const CHAVE_RASCUNHO = "portfolio:rascunho:v1";
const CHAVE_PUBLICADO = "portfolio:publicado:v1";
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
