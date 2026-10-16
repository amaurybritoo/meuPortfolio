// Valida e completa os dados do portfólio.
// Serve para o JSON publicado, para o rascunho do admin e para arquivos importados:
// se faltar algum campo, ele é preenchido com um valor seguro (o site nunca quebra).

import type {
  Aparencia, ConfigContato, ConfigDragao, ConfigSecao, Estatistica, Experiencia, GrupoHabilidades,
  Habilidade, Midia, Perfil, Portfolio, Projeto, Rede, Secoes, Seo, Teste,
} from "../tipos";
import { gerarId, limitar, slugify } from "../utilitarios/texto";
import dadosPublicados from "./portfolio.json";

const texto = (v: unknown, padrao = ""): string => (typeof v === "string" ? v : padrao);
const booleano = (v: unknown, padrao: boolean): boolean => (typeof v === "boolean" ? v : padrao);
const numero = (v: unknown, padrao: number, min: number, max: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? limitar(n, min, max) : padrao;
};
const cor = (v: unknown, padrao: string): string =>
  typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v.trim()) ? v.trim() : padrao;
const objeto = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const lista = <T>(v: unknown, mapear: (item: unknown, indice: number) => T): T[] =>
  Array.isArray(v) ? v.map(mapear) : [];
const textos = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((i): i is string => typeof i === "string") : [];

export const SECOES_PADRAO: Secoes = {
  sobre: { ativa: true, titulo: "Sobre mim", subtitulo: "" },
  habilidades: { ativa: true, titulo: "Habilidades", subtitulo: "" },
  projetos: { ativa: true, titulo: "Projetos", subtitulo: "" },
  experiencia: { ativa: true, titulo: "Formação e experiência", subtitulo: "" },
  contato: { ativa: true, titulo: "Contato", subtitulo: "" },
};

export const DRAGAO_PADRAO: ConfigDragao = {
  ativo: true, opacidade: 0.2, velocidade: 1, tamanho: 1, cor: "#c084fc", intervalo: 10,
};

function normalizarSecao(v: unknown, padrao: ConfigSecao): ConfigSecao {
  const o = objeto(v);
  return {
    ativa: booleano(o.ativa, padrao.ativa),
    titulo: texto(o.titulo, padrao.titulo),
    subtitulo: texto(o.subtitulo, padrao.subtitulo),
  };
}

function normalizarMidia(v: unknown): Midia {
  const o = objeto(v);
  return { tipo: o.tipo === "video" ? "video" : "img", src: texto(o.src), legenda: texto(o.legenda) };
}

function normalizarTeste(v: unknown): Teste {
  const o = objeto(v);
  return { nome: texto(o.nome), descricao: texto(o.descricao), imagem: texto(o.imagem) };
}

function normalizarProjeto(v: unknown, indice: number): Projeto {
  const o = objeto(v);
  const nome = texto(o.nome, `Projeto ${indice + 1}`);
  return {
    id: texto(o.id) || gerarId("proj"),
    slug: texto(o.slug) || slugify(nome),
    nome,
    categoria: texto(o.categoria),
    ano: texto(o.ano),
    resumo: texto(o.resumo) || texto(o.descricao).slice(0, 160),
    descricao: texto(o.descricao),
    capa: texto(o.capa) || texto(o.cardImage) || texto(o.imagem),
    banner: texto(o.banner) || texto(o.imagem) || texto(o.capa),
    tecnologias: textos(o.tecnologias),
    prints: lista(o.prints, normalizarMidia),
    testes: lista(o.testes, normalizarTeste),
    desafios: textos(o.desafios),
    solucoes: textos(o.solucoes),
    github: texto(o.github).trim(),
    site: texto(o.site).trim(),
    destaque: booleano(o.destaque, false),
    visivel: booleano(o.visivel, true),
  };
}

function normalizarRede(v: unknown): Rede {
  const o = objeto(v);
  return { id: texto(o.id) || gerarId("rede"), rotulo: texto(o.rotulo), url: texto(o.url), icone: texto(o.icone, "globo") };
}

function normalizarHabilidade(v: unknown): Habilidade {
  const o = objeto(v);
  return { id: texto(o.id) || gerarId("hab"), nome: texto(o.nome), icone: texto(o.icone, "codigo") };
}

function normalizarGrupo(v: unknown): GrupoHabilidades {
  const o = objeto(v);
  return { id: texto(o.id) || gerarId("grupo"), titulo: texto(o.titulo), itens: lista(o.itens, normalizarHabilidade) };
}

function normalizarEstatistica(v: unknown): Estatistica {
  const o = objeto(v);
  return { id: texto(o.id) || gerarId("num"), valor: texto(o.valor), rotulo: texto(o.rotulo) };
}

function normalizarExperiencia(v: unknown): Experiencia {
  const o = objeto(v);
  return {
    id: texto(o.id) || gerarId("exp"), periodo: texto(o.periodo), titulo: texto(o.titulo),
    local: texto(o.local), descricao: texto(o.descricao),
  };
}

function normalizarPerfil(v: unknown): Perfil {
  const o = objeto(v);
  return {
    nome: texto(o.nome, "Seu nome"),
    cargos: textos(o.cargos),
    frase: texto(o.frase),
    resumo: texto(o.resumo),
    sobre: textos(o.sobre),
    foto: texto(o.foto),
    logo: texto(o.logo),
    localizacao: texto(o.localizacao),
    disponivel: booleano(o.disponivel, false),
    textoDisponibilidade: texto(o.textoDisponibilidade, "Disponível para novos projetos"),
    curriculo: texto(o.curriculo).trim(),
    email: texto(o.email).trim(),
    whatsapp: texto(o.whatsapp).replace(/\D/g, ""),
    redes: lista(o.redes, normalizarRede),
    rodape: texto(o.rodape),
  };
}

function normalizarAparencia(v: unknown): Aparencia {
  const o = objeto(v);
  const d = objeto(o.dragao);
  return {
    corPrimaria: cor(o.corPrimaria, "#a855f7"),
    corSecundaria: cor(o.corSecundaria, "#38bdf8"),
    brilhoFundo: booleano(o.brilhoFundo, true),
    dragao: {
      ativo: booleano(d.ativo, DRAGAO_PADRAO.ativo),
      opacidade: numero(d.opacidade, DRAGAO_PADRAO.opacidade, 0.05, 0.4),
      velocidade: numero(d.velocidade, DRAGAO_PADRAO.velocidade, 0.4, 2),
      tamanho: numero(d.tamanho, DRAGAO_PADRAO.tamanho, 0.5, 1.6),
      cor: cor(d.cor, DRAGAO_PADRAO.cor),
      intervalo: numero(d.intervalo, DRAGAO_PADRAO.intervalo, 0, 60),
    },
  };
}

function normalizarContato(v: unknown): ConfigContato {
  const o = objeto(v);
  return {
    titulo: texto(o.titulo, "Vamos trabalhar juntos?"),
    texto: texto(o.texto),
    mensagemWhatsapp: texto(o.mensagemWhatsapp, "Olá! Vi seu portfólio e gostaria de conversar."),
    mostrarFormulario: booleano(o.mostrarFormulario, true),
  };
}

function normalizarSeo(v: unknown): Seo {
  const o = objeto(v);
  return { titulo: texto(o.titulo, "Portfólio"), descricao: texto(o.descricao) };
}

export function normalizarPortfolio(entrada: unknown): Portfolio {
  const o = objeto(entrada);
  const s = objeto(o.secoes);
  const projetos = lista(o.projetos, normalizarProjeto);
  // garante slugs únicos (dois projetos com o mesmo endereço quebrariam a página)
  const usados = new Set<string>();
  projetos.forEach((p) => {
    let slug = slugify(p.slug);
    let n = 2;
    while (usados.has(slug)) slug = `${slugify(p.slug)}-${n++}`;
    usados.add(slug);
    p.slug = slug;
  });
  return {
    versao: 1,
    perfil: normalizarPerfil(o.perfil),
    estatisticas: lista(o.estatisticas, normalizarEstatistica),
    habilidades: lista(o.habilidades, normalizarGrupo),
    experiencias: lista(o.experiencias, normalizarExperiencia),
    projetos,
    contato: normalizarContato(o.contato),
    secoes: {
      sobre: normalizarSecao(s.sobre, SECOES_PADRAO.sobre),
      habilidades: normalizarSecao(s.habilidades, SECOES_PADRAO.habilidades),
      projetos: normalizarSecao(s.projetos, SECOES_PADRAO.projetos),
      experiencia: normalizarSecao(s.experiencia, SECOES_PADRAO.experiencia),
      contato: normalizarSecao(s.contato, SECOES_PADRAO.contato),
    },
    aparencia: normalizarAparencia(o.aparencia),
    seo: normalizarSeo(o.seo),
  };
}

/** O que está publicado hoje: o arquivo src/data/portfolio.json (o admin atualiza esse arquivo). */
export const PUBLICADO: Portfolio = normalizarPortfolio(dadosPublicados);

// ---------- modelos em branco usados pelo admin ("Adicionar ...") ----------

export function novoProjeto(): Projeto {
  return normalizarProjeto({ id: gerarId("proj"), nome: "Novo projeto", slug: "novo-projeto", visivel: false }, 0);
}
export const novoTeste = (): Teste => ({ nome: "", descricao: "", imagem: "" });
export const novaMidia = (): Midia => ({ tipo: "img", src: "", legenda: "" });
export const novaRede = (): Rede => ({ id: gerarId("rede"), rotulo: "", url: "", icone: "globo" });
export const novaHabilidade = (): Habilidade => ({ id: gerarId("hab"), nome: "", icone: "codigo" });
export const novoGrupo = (): GrupoHabilidades => ({ id: gerarId("grupo"), titulo: "Novo grupo", itens: [] });
export const novaEstatistica = (): Estatistica => ({ id: gerarId("num"), valor: "", rotulo: "" });
export const novaExperiencia = (): Experiencia => ({ id: gerarId("exp"), periodo: "", titulo: "", local: "", descricao: "" });
