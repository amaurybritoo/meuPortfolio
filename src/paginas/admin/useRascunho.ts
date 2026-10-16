import { useCallback, useEffect, useMemo, useState } from "react";
import { PUBLICADO } from "../../data/padrao";
import type { Portfolio } from "../../tipos";
import {
  lerRascunho, lerUltimoPublicado, limparRascunho, salvarRascunho, salvarUltimoPublicado,
} from "../../utilitarios/armazenamento";

export type AtualizarDados = (alterar: (rascunho: Portfolio) => void) => void;

/**
 * Guarda o que está sendo editado no admin.
 * - salva automaticamente no navegador (rascunho) a cada alteração;
 * - compara com a última versão publicada para saber se há alterações pendentes.
 */
export function useRascunho() {
  const [baseline, setBaseline] = useState<Portfolio>(() => lerUltimoPublicado() ?? PUBLICADO);
  const [dados, setDados] = useState<Portfolio>(() => lerRascunho() ?? lerUltimoPublicado() ?? PUBLICADO);
  const [salvoNoNavegador, setSalvoNoNavegador] = useState(true);

  const alterado = useMemo(() => JSON.stringify(dados) !== JSON.stringify(baseline), [dados, baseline]);

  const atualizar = useCallback<AtualizarDados>((alterar) => {
    setDados((anterior) => {
      const copia = structuredClone(anterior);
      alterar(copia);
      return copia;
    });
  }, []);

  useEffect(() => {
    const espera = window.setTimeout(() => {
      if (alterado) setSalvoNoNavegador(salvarRascunho(dados));
      else {
        limparRascunho();
        setSalvoNoNavegador(true);
      }
    }, 400);
    return () => window.clearTimeout(espera);
  }, [dados, alterado]);

  const substituir = useCallback((novos: Portfolio) => setDados(novos), []);
  const descartar = useCallback(() => setDados(baseline), [baseline]);
  const marcarPublicado = useCallback((publicado: Portfolio) => {
    salvarUltimoPublicado(publicado);
    limparRascunho();
    setBaseline(publicado);
    setDados(publicado);
  }, []);
  const sincronizarComSite = useCallback(() => {
    limparRascunho();
    setBaseline(PUBLICADO);
    setDados(PUBLICADO);
  }, []);

  return { dados, atualizar, alterado, salvoNoNavegador, substituir, descartar, marcarPublicado, sincronizarComSite };
}
