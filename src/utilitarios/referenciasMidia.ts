import type { Portfolio } from "../tipos";
import { ehDataUrl } from "./imagem";

export interface ReferenciaImagem {
  ler: () => string;
  escrever: (valor: string) => void;
}

function referencia<T extends object>(obj: T, chave: keyof T): ReferenciaImagem {
  return {
    ler: () => String(obj[chave] ?? ""),
    escrever: (valor) => { (obj as Record<keyof T, unknown>)[chave] = valor; },
  };
}

export function coletarImagens(dados: Portfolio): ReferenciaImagem[] {
  const refs: ReferenciaImagem[] = [referencia(dados.perfil, "foto"), referencia(dados.perfil, "logo"), referencia(dados.perfil, "curriculo")];
  dados.projetos.forEach((projeto) => {
    refs.push(referencia(projeto, "capa"), referencia(projeto, "banner"));
    projeto.prints.forEach((midia) => refs.push(referencia(midia, "src")));
    projeto.testes.forEach((teste) => refs.push(referencia(teste, "imagem"), referencia(teste, "video")));
  });
  return refs.filter((ref) => ehDataUrl(ref.ler()));
}
