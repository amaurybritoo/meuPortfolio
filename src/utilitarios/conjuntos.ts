import type { Projeto } from "../tipos";

/**
 * Regras de "conjunto de projetos" em um só lugar, para a home, o modal e a página de projeto
 * sempre concordarem entre si. Todas as funções recebem a lista de projetos que o visitante
 * pode ver (o contexto já tira os rascunhos fora do modo de pré-visualização).
 */

/** Projetos que fazem parte do conjunto, na ordem escolhida no admin (sem repetidos nem o próprio). */
export function membrosDoConjunto(conjunto: Projeto, projetos: Projeto[]): Projeto[] {
  if (!conjunto.colecao) return [];
  const vistos = new Set<string>();
  return conjunto.projetosRelacionados.flatMap((id) => {
    if (id === conjunto.id || vistos.has(id)) return [];
    vistos.add(id);
    const membro = projetos.find((item) => item.id === id);
    return membro ? [membro] : [];
  });
}

/** Ids de todos os projetos que estão dentro de algum conjunto (eles não aparecem soltos na lista). */
export function idsEmConjuntos(projetos: Projeto[]): Set<string> {
  return new Set(projetos.filter((p) => p.colecao).flatMap((p) => membrosDoConjunto(p, projetos).map((m) => m.id)));
}

/** Conjunto ao qual o projeto pertence, se houver. */
export function conjuntoDoMembro(projeto: Projeto, projetos: Projeto[]): Projeto | undefined {
  return projetos.find((c) => c.colecao && c.id !== projeto.id && membrosDoConjunto(c, projetos).some((m) => m.id === projeto.id));
}

/** Melhor imagem disponível para representar o projeto (capa, banner ou o primeiro print). */
export function imagemDoProjeto(projeto: Projeto): string {
  return projeto.capa || projeto.banner || projeto.prints.find((midia) => midia.tipo === "img" && midia.src)?.src || "";
}

/** Tecnologias do conjunto; se ele não tiver as suas, junta as dos projetos que o compõem. */
export function tecnologiasDoConjunto(conjunto: Projeto, membros: Projeto[]): string[] {
  if (conjunto.tecnologias.length > 0) return conjunto.tecnologias;
  return Array.from(new Set(membros.flatMap((m) => m.tecnologias)));
}
