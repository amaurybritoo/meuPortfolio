// Tipos de TODO o conteúdo do portfólio.
// Tudo que aparece no site (e que é editável no /admin) está descrito aqui.

export type TipoMidia = "img" | "video";

export interface Midia {
  tipo: TipoMidia;
  src: string;
  legenda: string;
}

export interface Teste {
  nome: string;
  descricao: string;
  imagem: string; // opcional (pode ficar vazio)
  video?: string; // opcional, evidência em vídeo
}

export interface Projeto {
  id: string;
  slug: string; // endereço do projeto: /projeto/<slug>
  nome: string;
  categoria: string; // ex.: "Front-end", "QA / Testes" (cria os filtros automaticamente)
  ano: string;
  resumo: string; // texto curto que aparece no card
  descricao: string; // texto completo (use Enter para criar parágrafos)
  capa: string; // imagem do card
  banner: string; // imagem grande da página do projeto
  tecnologias: string[];
  prints: Midia[];
  colecao: boolean;
  projetosRelacionados: string[];
  testes: Teste[];
  desafios: string[];
  solucoes: string[];
  github: string;
  site: string;
  destaque: boolean;
  visivel: boolean; // false = rascunho (não aparece no site)
}

export interface Rede {
  id: string;
  rotulo: string;
  url: string;
  icone: string; // nome do ícone (ver utilitarios/icones.ts)
}

export interface Perfil {
  nome: string;
  cargos: string[]; // aparecem alternando no topo do site
  frase: string; // frase principal do topo
  resumo: string; // texto curto "sobre" do topo
  sobre: string[]; // parágrafos da seção "Sobre mim"
  foto: string;
  logo: string;
  localizacao: string;
  disponivel: boolean;
  textoDisponibilidade: string;
  curriculo: string; // link/arquivo do currículo (opcional)
  email: string;
  whatsapp: string; // só números com DDI, ex.: 5592999999999
  redes: Rede[];
  rodape: string;
}

export interface Estatistica {
  id: string;
  valor: string;
  rotulo: string;
}

export interface Habilidade {
  id: string;
  nome: string;
  icone: string;
}

export interface GrupoHabilidades {
  id: string;
  titulo: string;
  itens: Habilidade[];
}

export interface Experiencia {
  id: string;
  periodo: string;
  titulo: string;
  local: string;
  descricao: string;
}

export interface Formacao {
  id: string;
  periodo: string;
  titulo: string;
  local: string;
  descricao: string;
}

export interface ConfigSecao {
  ativa: boolean;
  titulo: string;
  subtitulo: string;
}

export interface ConfigDragao {
  ativo: boolean;
  opacidade: number; // 0.05 a 0.4
  velocidade: number; // 0.4 a 2
  tamanho: number; // 0.5 a 1.6
  cor: string; // cor do traço (hex)
  intervalo: number; // segundos de pausa entre um voo e outro
}

export interface Aparencia {
  corPrimaria: string;
  corSecundaria: string;
  brilhoFundo: boolean;
  dragao: ConfigDragao;
}

export interface ConfigContato {
  titulo: string;
  texto: string;
  mensagemWhatsapp: string;
  mostrarFormulario: boolean;
}

export interface Seo {
  titulo: string;
  descricao: string;
}

export interface Secoes {
  sobre: ConfigSecao;
  habilidades: ConfigSecao;
  projetos: ConfigSecao;
  experiencia: ConfigSecao;
  formacao: ConfigSecao;
  contato: ConfigSecao;
}

export interface Portfolio {
  versao: number;
  perfil: Perfil;
  estatisticas: Estatistica[];
  habilidades: GrupoHabilidades[];
  experiencias: Experiencia[];
  formacoes: Formacao[];
  projetos: Projeto[];
  contato: ConfigContato;
  secoes: Secoes;
  aparencia: Aparencia;
  seo: Seo;
}
