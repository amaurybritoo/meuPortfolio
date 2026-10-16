import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PUBLICADO } from "../data/padrao";
import { detectarPreview, lerRascunho } from "../utilitarios/armazenamento";
import { ContextoPortfolio } from "./contextoPortfolio";
import { aplicarTema } from "./tema";

export default function PortfolioProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation();
  const preview = useMemo(() => detectarPreview(search), [search]);
  const dados = useMemo(() => (preview ? lerRascunho() : null) ?? PUBLICADO, [preview]);

  useEffect(() => {
    aplicarTema(dados.aparencia);
  }, [dados]);

  const valor = useMemo(() => ({ dados, preview, projetos: preview ? dados.projetos : dados.projetos.filter((p) => p.visivel) }), [dados, preview]);
  return <ContextoPortfolio.Provider value={valor}>{children}</ContextoPortfolio.Provider>;
}
