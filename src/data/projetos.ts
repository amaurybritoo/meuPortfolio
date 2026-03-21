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
}

export const projetos: Projeto[] = [
  {
    id: 1,
    nome: "Projeto Andreia",
    slug: "projeto-andreia",
    descricao:
      "Desenvolvimento de um site institucional com foco em experiência do usuário e testes de qualidade (QA).",
    imagem: "https://picsum.photos/900/400",
    cardImage: "https://picsum.photos/500/300?1",
    tecnologias: ["React", "TypeScript", "CSS", "Vite"],
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
    desafios:
      "Garantir compatibilidade entre navegadores e manter performance alta mesmo com imagens e animações.",
    solucoes:
      "Uso de lazy loading, otimização de imagens e testes em múltiplos navegadores.",
    github: "https://github.com/amaurybritoo/Dra.AndreiaAlmeida.git"
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
  },
    
];