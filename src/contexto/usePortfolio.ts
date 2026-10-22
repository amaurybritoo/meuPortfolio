import { useContext } from "react";
import { ContextoPortfolio } from "./contextoPortfolio";
import type { ValorPortfolio } from "./contextoPortfolio";

export function usePortfolio(): ValorPortfolio {
  const valor = useContext(ContextoPortfolio);
  if (!valor) throw new Error("usePortfolio precisa estar dentro de <PortfolioProvider>.");
  return valor;
}
