export interface Projeto {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  imagem: string;
  cardImage: string;
  tecnologias: string[];
  testes: { nome: string; imagem: string }[];
  prints: { tipo: string; src: string }[];
  desafios: string;
  solucoes: string;
  github: string;
  site: string;
}

export const projetos: Projeto[] = [
  {
    id: 1,

    //---- NOME, SLUG, DESCRIÇÃO RESUMIDA E IMAGEM DO CARD (essa info aparece no card e no modal) ----//
    nome: "Site da Dra.Andréia",
    slug: "projeto-andreia",
    
    //---- DESCRIÇÃO COMPLETA DO PROJETO(sobre o projeto) ----//
    descricao:
      "Este projeto consiste no desenvolvimento de uma landing page moderna e estratégica para minha namorada, com foco em apresentação profissional, conversão e experiência do usuário. \n A proposta foi criar uma interface limpa, com visual elegante e elementos em destaque, transmitindo credibilidade e facilitanto o contato do cliente com os serviços oferecidos. O site foi desenvolvido utilizando React com Vite, priorizando performace, organização de código e escalabilidade, além de estilização com CSS puro para garantir fidelidade ao design e controle total da interface ",
    
    //---- IMAGENS: imagem principal do projeto e imagem do card (pode ser a mesma) ----//
    imagem: "/Projetos/site-andreia/img/banner.png",
    cardImage: "/Projetos/site-andreia/img/banner.png",
    
    //---- TECNOLOGIAS UTILIZADAS ----//
    tecnologias: ["React", "TypeScript", "CSS", "Vite",],
   
   //---- TESTES REALIZADOS: cada teste tem um nome e uma imagem ilustrativa ----//
    testes: [
      {
        nome: "Responsividade",
        imagem: "https://picsum.photos/400/200?1",
      },
      {
        nome: "Cross-browser",
        imagem: "https://picsum.photos/400/200?2",
      },
      {
        nome: "Performance",
        imagem: "https://picsum.photos/400/200?3",
      },
    ],


    //---- PRINTS: pode ser imagem ou vídeo, basta colocar tipo "img" ou "video" e a src correta ----//
    prints: [
    { 
      tipo: "img", src: "https://picsum.photos/600/400?1" 
    },
    { 
      tipo: "img", src: "https://picsum.photos/600/400?2" 
    },
    { 
      tipo: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" 
    },
],

    //---- DESAFIOS ----//    
    desafios:
      "Garantir compatibilidade entre navegadores e manter performance alta mesmo com imagens e animações.",
    
      //---- SOLUÇÕES ----//
      solucoes:
      "Uso de lazy loading, otimização de imagens e testes em múltiplos navegadores.",
    
      //---- LINK DO GITHUB (pode ser do projeto ou do perfil) ----//    
      github: "https://github.com/amaurybritoo/Dra.AndreiaAlmeida.git",
      site: "https://dra-andreia-almeida.vercel.app/",
  },

  {
    id: 2,
    nome: "Dashboard",
    slug: "dashboard",
    descricao: "Painel interativo com gráficos para análise de dados.",
    imagem: "https://picsum.photos/900/400?2",
    cardImage: "https://picsum.photos/500/300?2",
    tecnologias: ["React", "D3.js", "Node.js", "MongoDB"],
    testes: [
      {
        nome: "Interatividade",
        imagem: "https://picsum.photos/400/200?4",
      },
      {
        nome: "Carregamento de Dados",
        imagem: "https://picsum.photos/400/200?5",
      },
      {
        nome: "Responsividade",
        imagem: "https://picsum.photos/400/200?6",
      },
    ],
    prints: [
  { tipo: "img", src: "https://picsum.photos/600/400?1" },
  { tipo: "img", src: "https://picsum.photos/600/400?2" },
  { tipo: "img", src: "https://picsum.photos/600/400?3" },
    ],
    desafios: "Integrar gráficos dinâmicos e otimizar consultas de dados.",
    solucoes: "Uso de bibliotecas como D3.js e implementação de caching.",
    github: "https://github.com/",
    site: "https://dashboardexemplo.com",
  },
  {
    id: 3,
    nome: "Landing Page",
    slug: "landing-page",
    descricao: "Página otimizada para conversão de leads.",
    imagem: "https://picsum.photos/900/400?3",
    cardImage: "https://picsum.photos/500/300?3",
    tecnologias: ["HTML", "CSS", "JavaScript", "Google Analytics"],
    testes: [
      {
        nome: "Conversão",
        imagem: "https://picsum.photos/400/200?7",
      },
      {
        nome: "SEO",
        imagem: "https://picsum.photos/400/200?8",
      },
      {
        nome: "Velocidade",
        imagem: "https://picsum.photos/400/200?9",
      },
    ],

    prints: [
  { tipo: "img", src: "https://picsum.photos/600/400?1" },
  { tipo: "img", src: "https://picsum.photos/600/400?2" },
  { tipo: "img", src: "https://picsum.photos/600/400?3" },
],
    desafios: "Aumentar taxa de conversão e otimizar para motores de busca.",
    solucoes: "Design focado em CTA e implementação de SEO on-page.",
    github: "https://github.com/",
    site: " ",
  },
    
];