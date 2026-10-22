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
        const conteudo = corpo?.content;
        const perfil = conteudo?.perfil;
        const nome = typeof perfil?.nome === "string" ? perfil.nome : "";

        // Evita que conteúdo de outro projeto/site seja carregado caso a variável
        // SUPABASE_URL tenha sido apontada para um banco incompatível por engano.
        if (!conteudo || typeof conteudo !== "object" || !perfil || !Array.isArray(conteudo.projetos) || !Array.isArray(conteudo.habilidades)) {
          console.warn("Conteúdo remoto ignorado: estrutura incompatível com o portfólio pessoal.");
          return;
        }

        // Migra a identidade antiga sem exigir uma edição manual imediata no banco.
        const conteudoAtualizado = nome === "Amaury Brito"
          ? { ...conteudo, perfil: { ...perfil, nome: "Amaury.dev" } }
          : conteudo;
        if (ativo) setPublicado(normalizarPortfolio(conteudoAtualizado));
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
