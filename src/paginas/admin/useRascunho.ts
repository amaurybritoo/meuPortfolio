import { useCallback, useEffect, useMemo, useState } from "react";
import { PUBLICADO } from "../../data/padrao";
import type { Portfolio } from "../../tipos";
import {
  lerRascunho, lerUltimoPublicado, limparRascunho, salvarRascunho, salvarUltimoPublicado,
} from "../../utilitarios/armazenamento";

export type AtualizarDados = (alterar: (rascunho: Portfolio) => void) => void;

/** Atualiza projetos adicionados ao site sem descartar conteúdo editado no navegador. */
function incluirProjetosPublicados(dados: Portfolio): Portfolio {
  const atualizado = structuredClone(dados);
  for (const publicado of PUBLICADO.projetos.filter((projeto) => projeto.github)) {
    const indice = atualizado.projetos.findIndex((projeto) => projeto.id === publicado.id);
    if (indice < 0) {
      atualizado.projetos.push(structuredClone(publicado));
      continue;
    }

    const salvo = atualizado.projetos[indice];
    atualizado.projetos[indice] = {
      ...publicado,
      ...salvo,
      slug: salvo.slug || publicado.slug,
      nome: salvo.nome || publicado.nome,
      categoria: salvo.categoria || publicado.categoria,
      ano: salvo.ano || publicado.ano,
      resumo: salvo.resumo || publicado.resumo,
      descricao: salvo.descricao || publicado.descricao,
      capa: salvo.capa || publicado.capa,
      banner: salvo.banner || publicado.banner,
      tecnologias: salvo.tecnologias.length ? salvo.tecnologias : publicado.tecnologias,
      prints: salvo.prints.length ? salvo.prints : publicado.prints,
      testes: salvo.testes.length ? salvo.testes : publicado.testes,
      desafios: salvo.desafios.length ? salvo.desafios : publicado.desafios,
      solucoes: salvo.solucoes.length ? salvo.solucoes : publicado.solucoes,
      github: salvo.github || publicado.github,
      site: salvo.site || publicado.site,
    };
  }
  return atualizado;
}

/**
 * Guarda o que está sendo editado no admin.
 * - salva automaticamente no navegador (rascunho) a cada alteração;
 * - compara com a última versão publicada para saber se há alterações pendentes.
 */
export function useRascunho() {
  const [baseline, setBaseline] = useState<Portfolio>(() => incluirProjetosPublicados(lerUltimoPublicado() ?? PUBLICADO));
  const [dados, setDados] = useState<Portfolio>(() => incluirProjetosPublicados(lerRascunho() ?? lerUltimoPublicado() ?? PUBLICADO));
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
