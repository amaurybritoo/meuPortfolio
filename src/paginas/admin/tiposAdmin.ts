import type { Portfolio } from "../../tipos";
import type { AtualizarDados } from "./useRascunho";

export interface PropsAba {
  dados: Portfolio;
  atualizar: AtualizarDados;
  /** projeto aberto na aba Projetos (guardado no Admin para não se perder ao trocar de aba) */
  projetoSelecionado: string;
  aoSelecionarProjeto: (id: string) => void;
}
