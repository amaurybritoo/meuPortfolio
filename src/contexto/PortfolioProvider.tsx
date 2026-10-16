import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { normalizarPortfolio, PUBLICADO } from "../data/padrao";
import { detectarPreview, lerRascunho } from "../utilitarios/armazenamento";
import { ContextoPortfolio } from "./contextoPortfolio";
import { aplicarTema } from "./tema";

export default function PortfolioProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation();
  const preview = useMemo(() => detectarPreview(search), [search]);
  const [publicado, setPublicado] = useState(PUBLICADO);

  useEffect(() => {
    let ativo = true;
    void fetch("/api/portfolio", { cache: "no-store" })
      .then(async (resposta) => {
        if (!resposta.ok) return;
        const corpo = await resposta.json().catch(() => ({}));
        if (ativo && corpo.content) setPublicado(normalizarPortfolio(corpo.content));
      })
      .catch((erro) => console.warn("O conteúdo salvo não foi carregado; usando os dados locais.", erro));
    return () => { ativo = false; };
  }, []);

  const dados = useMemo(() => (preview ? lerRascunho() : null) ?? publicado, [preview, publicado]);

  useEffect(() => {
    aplicarTema(dados.aparencia);
  }, [dados]);

  const valor = useMemo(() => ({ dados, preview, projetos: preview ? dados.projetos : dados.projetos.filter((p) => p.visivel) }), [dados, preview]);
  return <ContextoPortfolio.Provider value={valor}>{children}</ContextoPortfolio.Provider>;
}
