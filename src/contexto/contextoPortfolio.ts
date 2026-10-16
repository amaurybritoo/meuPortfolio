import { createContext } from "react";
import type { Portfolio, Projeto } from "../tipos";

export interface ValorPortfolio {
  dados: Portfolio;
  /** true quando o site está mostrando o rascunho do admin em vez do conteúdo publicado */
  preview: boolean;
  /** projetos que aparecem no site (na prévia do admin, os rascunhos também aparecem) */
  projetos: Projeto[];
}

export const ContextoPortfolio = createContext<ValorPortfolio | null>(null);
