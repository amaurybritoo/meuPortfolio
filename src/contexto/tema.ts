import type { Aparencia } from "../tipos";
import { hexParaRgb } from "../utilitarios/texto";

/** Aplica as cores escolhidas no admin como variáveis CSS do site. */
export function aplicarTema(aparencia: Aparencia): void {
  const raiz = document.documentElement;
  raiz.style.setProperty("--cor-primaria", aparencia.corPrimaria);
  raiz.style.setProperty("--cor-primaria-rgb", hexParaRgb(aparencia.corPrimaria));
  raiz.style.setProperty("--cor-secundaria", aparencia.corSecundaria);
  raiz.style.setProperty("--cor-secundaria-rgb", hexParaRgb(aparencia.corSecundaria));
  raiz.dataset.brilho = aparencia.brilhoFundo ? "sim" : "nao";
}
