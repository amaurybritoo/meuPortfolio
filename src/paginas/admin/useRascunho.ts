import { useCallback, useEffect, useMemo, useState } from "react";
import { PUBLICADO, normalizarPortfolio } from "../../data/padrao";
import type { Portfolio } from "../../tipos";
import { lerRascunho, lerUltimoPublicado, limparRascunho, salvarRascunho, salvarUltimoPublicado } from "../../utilitarios/armazenamento";

export type AtualizarDados = (alterar: (rascunho: Portfolio) => void) => void;

export function useRascunho() {
  const [local] = useState(() => lerRascunho());
  const [ultimoLocal] = useState(() => lerUltimoPublicado());
  const [baseline, setBaseline] = useState<Portfolio>(() => ultimoLocal ?? PUBLICADO);
  const [dados, setDados] = useState<Portfolio>(() => local ?? ultimoLocal ?? PUBLICADO);
  const [salvoNoNavegador, setSalvoNoNavegador] = useState(true);
  const [carregado, setCarregado] = useState(false);

  const alterado = useMemo(() => JSON.stringify(dados) !== JSON.stringify(baseline), [dados, baseline]);

  useEffect(() => {
    let ativo = true;
    void fetch("/api/admin/portfolio", { credentials: "same-origin", cache: "no-store" })
      .then(async (resposta) => {
        const corpo = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(corpo.error || "Não foi possível carregar os dados do Supabase.");
        if (!ativo) return;
        const remoto = corpo.content ? normalizarPortfolio(corpo.content) : ultimoLocal ?? PUBLICADO;
        setBaseline(remoto);
        if (!local) setDados(remoto);
      })
      .catch((erro) => {
        console.error("Falha ao carregar rascunho remoto:", erro);
      })
      .finally(() => {
        if (ativo) setCarregado(true);
      });
    return () => { ativo = false; };
  }, [local, ultimoLocal]);

  const atualizar = useCallback<AtualizarDados>((alterar) => {
    setDados((anterior) => {
      const copia = structuredClone(anterior);
      alterar(copia);
      return copia;
    });
  }, []);

  useEffect(() => {
    if (!carregado) return;
    const espera = window.setTimeout(() => {
      if (alterado) setSalvoNoNavegador(salvarRascunho(dados));
      else {
        limparRascunho();
        setSalvoNoNavegador(true);
      }
    }, 400);
    return () => window.clearTimeout(espera);
  }, [dados, alterado, carregado]);

  const substituir = useCallback((novos: Portfolio) => setDados(novos), []);
  const descartar = useCallback(() => setDados(baseline), [baseline]);
  const marcarPublicado = useCallback((publicado: Portfolio) => {
    salvarUltimoPublicado(publicado);
    limparRascunho();
    setBaseline(publicado);
    setDados(publicado);
  }, []);
  const sincronizarComSite = useCallback(() => {
    void fetch("/api/admin/portfolio", { credentials: "same-origin", cache: "no-store" })
      .then(async (resposta) => {
        const corpo = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(corpo.error || "Não foi possível carregar o conteúdo salvo.");
        const remoto = corpo.content ? normalizarPortfolio(corpo.content) : PUBLICADO;
        limparRascunho();
        setBaseline(remoto);
        setDados(remoto);
      })
      .catch((erro) => window.alert(erro instanceof Error ? erro.message : "Falha ao recarregar o conteúdo."));
  }, []);

  return { dados, atualizar, alterado, salvoNoNavegador, substituir, descartar, marcarPublicado, sincronizarComSite, carregado };
}
