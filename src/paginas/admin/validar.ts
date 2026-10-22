import type { Portfolio } from "../../tipos";

export interface Problema {
  nivel: "erro" | "aviso";
  mensagem: string;
  aba: string;
  /** id do projeto relacionado (a aba Projetos abre já nele) */
  alvo?: string;
}

const ehLinkValido = (valor: string): boolean => /^(https?:\/\/|\/|mailto:|data:)/i.test(valor.trim());

/** Confere o conteúdo antes de publicar e devolve avisos em português claro. */
export function validarPortfolio(dados: Portfolio): Problema[] {
  const problemas: Problema[] = [];
  const erro = (aba: string, mensagem: string, alvo?: string) => problemas.push({ nivel: "erro", aba, mensagem, alvo });
  const aviso = (aba: string, mensagem: string, alvo?: string) => problemas.push({ nivel: "aviso", aba, mensagem, alvo });

  if (!dados.perfil.nome.trim()) erro("perfil", "Informe o seu nome (aba Perfil).");
  if (dados.perfil.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.perfil.email)) erro("perfil", "O e-mail parece inválido.");
  if (dados.perfil.whatsapp && dados.perfil.whatsapp.length < 10) aviso("perfil", "O WhatsApp parece curto. Use DDI + DDD + número, só dígitos (ex.: 5592999999999).");
  if (!dados.perfil.email && !dados.perfil.whatsapp) aviso("perfil", "Sem e-mail e sem WhatsApp, o formulário de contato não aparece.");
  dados.perfil.redes.forEach((r) => {
    if (r.url && !ehLinkValido(r.url)) erro("perfil", `O link da rede "${r.rotulo || "sem nome"}" precisa começar com https://`);
  });

  const slugs = new Map<string, string>();
  dados.projetos.forEach((p) => {
    const nome = p.nome.trim() || "(sem nome)";
    if (!p.nome.trim()) erro("projetos", "Há um projeto sem nome.", p.id);
    if (!p.slug.trim()) erro("projetos", `O projeto "${nome}" está sem endereço (slug).`, p.id);
    if (slugs.has(p.slug)) erro("projetos", `Os projetos "${slugs.get(p.slug)}" e "${nome}" usam o mesmo endereço "${p.slug}".`, p.id);
    slugs.set(p.slug, nome);
    if (p.projetosRelacionados.includes(p.id)) erro("projetos", `O conjunto "${nome}" não pode incluir a si próprio.`, p.id);
    if (p.colecao && p.projetosRelacionados.length === 0) erro("projetos", `Selecione pelo menos um projeto para formar o conjunto "${nome}".`, p.id);
    if (new Set(p.projetosRelacionados).size !== p.projetosRelacionados.length) erro("projetos", `Há um projeto repetido no conjunto "${nome}".`, p.id);
    p.projetosRelacionados.forEach((id) => {
      const relacionado = dados.projetos.find((item) => item.id === id);
      if (!relacionado) erro("projetos", `Um projeto incluído no conjunto "${nome}" não existe mais.`, p.id);
      else if (relacionado.colecao) erro("projetos", `O conjunto "${nome}" não pode incluir outro conjunto (${relacionado.nome}).`, p.id);
    });
    if (p.site && !ehLinkValido(p.site)) erro("projetos", `O link do site de "${nome}" precisa começar com https://`, p.id);
    if (p.github && !ehLinkValido(p.github)) erro("projetos", `O link do GitHub de "${nome}" precisa começar com https://`, p.id);
    if (p.visivel) {
      if (!p.capa) aviso("projetos", `"${nome}" não tem imagem de capa (o card mostrará um desenho padrão).`, p.id);
      if (!p.resumo.trim()) aviso("projetos", `"${nome}" está sem resumo para o card.`, p.id);
    }
  });
  const pertencentes = new Map<string, string>();
  dados.projetos.filter((p) => p.colecao).forEach((colecao) => colecao.projetosRelacionados.forEach((id) => {
    const anterior = pertencentes.get(id);
    if (anterior && anterior !== colecao.id) erro("projetos", `Um projeto só pode pertencer a um conjunto. Confira "${colecao.nome}" e "${dados.projetos.find((p) => p.id === anterior)?.nome ?? "outro conjunto"}".`, colecao.id);
    pertencentes.set(id, colecao.id);
  }));
  if (!dados.projetos.some((p) => p.visivel) && dados.secoes.projetos.ativa) aviso("projetos", "Nenhum projeto está visível: a seção Projetos não aparece no site.");
  if (!dados.perfil.foto) aviso("perfil", "Sem foto no topo do site.");
  if (!dados.seo.descricao.trim()) aviso("seo", "Escreva uma descrição para aparecer no Google e ao compartilhar o link.");
  return problemas;
}
