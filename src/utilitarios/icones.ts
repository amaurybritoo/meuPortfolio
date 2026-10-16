// Ícones disponíveis para redes sociais e habilidades (nome -> ícone).
// Para usar outro ícone do pacote react-icons, importe aqui e acrescente na lista.

import type { IconType } from "react-icons";
import {
  FaBehance, FaBolt, FaBriefcase, FaBug, FaCode, FaCog, FaCss3Alt, FaDev, FaDiscord, FaDribbble,
  FaEnvelope, FaFacebook, FaFileAlt, FaFlask, FaGithub, FaGlobe, FaGraduationCap, FaHtml5, FaImage,
  FaInstagram, FaLaptopCode, FaLink, FaLinkedin, FaMedium, FaMobileAlt, FaPalette, FaRocket, FaSearch,
  FaStar, FaTelegram, FaTiktok, FaTools, FaTwitter, FaUser, FaVial, FaWhatsapp, FaYoutube,
} from "react-icons/fa";
import {
  SiCypress, SiDocker, SiEslint, SiExpress, SiFigma, SiFirebase, SiGit, SiGithub, SiGoogleanalytics,
  SiJavascript, SiJest, SiJira, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiNpm, SiPostgresql,
  SiPostman, SiPython, SiReact, SiRedux, SiSass, SiSelenium, SiSupabase, SiTailwindcss, SiTestinglibrary,
  SiTypescript, SiVercel, SiVite, SiVitest, SiWordpress,
} from "react-icons/si";

export interface OpcaoIcone {
  valor: string;
  rotulo: string;
  componente: IconType;
}

const REDES: OpcaoIcone[] = [
  { valor: "github", rotulo: "GitHub", componente: FaGithub },
  { valor: "linkedin", rotulo: "LinkedIn", componente: FaLinkedin },
  { valor: "instagram", rotulo: "Instagram", componente: FaInstagram },
  { valor: "whatsapp", rotulo: "WhatsApp", componente: FaWhatsapp },
  { valor: "email", rotulo: "E-mail", componente: FaEnvelope },
  { valor: "youtube", rotulo: "YouTube", componente: FaYoutube },
  { valor: "twitter", rotulo: "X / Twitter", componente: FaTwitter },
  { valor: "facebook", rotulo: "Facebook", componente: FaFacebook },
  { valor: "tiktok", rotulo: "TikTok", componente: FaTiktok },
  { valor: "telegram", rotulo: "Telegram", componente: FaTelegram },
  { valor: "discord", rotulo: "Discord", componente: FaDiscord },
  { valor: "behance", rotulo: "Behance", componente: FaBehance },
  { valor: "dribbble", rotulo: "Dribbble", componente: FaDribbble },
  { valor: "medium", rotulo: "Medium", componente: FaMedium },
  { valor: "devto", rotulo: "DEV.to", componente: FaDev },
  { valor: "globo", rotulo: "Site / outro", componente: FaGlobe },
  { valor: "link", rotulo: "Link", componente: FaLink },
];

const TECNOLOGIAS: OpcaoIcone[] = [
  { valor: "react", rotulo: "React", componente: SiReact },
  { valor: "typescript", rotulo: "TypeScript", componente: SiTypescript },
  { valor: "javascript", rotulo: "JavaScript", componente: SiJavascript },
  { valor: "html5", rotulo: "HTML", componente: FaHtml5 },
  { valor: "css3", rotulo: "CSS", componente: FaCss3Alt },
  { valor: "vite", rotulo: "Vite", componente: SiVite },
  { valor: "nextjs", rotulo: "Next.js", componente: SiNextdotjs },
  { valor: "nodejs", rotulo: "Node.js", componente: SiNodedotjs },
  { valor: "express", rotulo: "Express", componente: SiExpress },
  { valor: "redux", rotulo: "Redux", componente: SiRedux },
  { valor: "tailwind", rotulo: "Tailwind CSS", componente: SiTailwindcss },
  { valor: "sass", rotulo: "Sass", componente: SiSass },
  { valor: "cypress", rotulo: "Cypress", componente: SiCypress },
  { valor: "selenium", rotulo: "Selenium", componente: SiSelenium },
  { valor: "jest", rotulo: "Jest", componente: SiJest },
  { valor: "vitest", rotulo: "Vitest", componente: SiVitest },
  { valor: "testinglibrary", rotulo: "Testing Library", componente: SiTestinglibrary },
  { valor: "postman", rotulo: "Postman", componente: SiPostman },
  { valor: "jira", rotulo: "Jira", componente: SiJira },
  { valor: "git", rotulo: "Git", componente: SiGit },
  { valor: "githubtech", rotulo: "GitHub (logo)", componente: SiGithub },
  { valor: "vercel", rotulo: "Vercel", componente: SiVercel },
  { valor: "figma", rotulo: "Figma", componente: SiFigma },
  { valor: "docker", rotulo: "Docker", componente: SiDocker },
  { valor: "npm", rotulo: "npm", componente: SiNpm },
  { valor: "eslint", rotulo: "ESLint", componente: SiEslint },
  { valor: "python", rotulo: "Python", componente: SiPython },
  { valor: "mongodb", rotulo: "MongoDB", componente: SiMongodb },
  { valor: "postgresql", rotulo: "PostgreSQL", componente: SiPostgresql },
  { valor: "mysql", rotulo: "MySQL", componente: SiMysql },
  { valor: "firebase", rotulo: "Firebase", componente: SiFirebase },
  { valor: "supabase", rotulo: "Supabase", componente: SiSupabase },
  { valor: "googleanalytics", rotulo: "Google Analytics", componente: SiGoogleanalytics },
  { valor: "wordpress", rotulo: "WordPress", componente: SiWordpress },
];

const GERAIS: OpcaoIcone[] = [
  { valor: "codigo", rotulo: "Código", componente: FaCode },
  { valor: "teste", rotulo: "Teste / QA", componente: FaVial },
  { valor: "bug", rotulo: "Bug", componente: FaBug },
  { valor: "responsivo", rotulo: "Responsivo / mobile", componente: FaMobileAlt },
  { valor: "notebook", rotulo: "Notebook", componente: FaLaptopCode },
  { valor: "raio", rotulo: "Performance", componente: FaBolt },
  { valor: "foguete", rotulo: "Foguete", componente: FaRocket },
  { valor: "estrela", rotulo: "Estrela", componente: FaStar },
  { valor: "lab", rotulo: "Laboratório", componente: FaFlask },
  { valor: "ferramentas", rotulo: "Ferramentas", componente: FaTools },
  { valor: "engrenagem", rotulo: "Engrenagem", componente: FaCog },
  { valor: "paleta", rotulo: "Design", componente: FaPalette },
  { valor: "busca", rotulo: "Busca", componente: FaSearch },
  { valor: "usuario", rotulo: "Pessoa", componente: FaUser },
  { valor: "imagem", rotulo: "Imagem", componente: FaImage },
  { valor: "documento", rotulo: "Documento", componente: FaFileAlt },
  { valor: "formacao", rotulo: "Formação", componente: FaGraduationCap },
  { valor: "trabalho", rotulo: "Trabalho", componente: FaBriefcase },
];

export const OPCOES_ICONES_REDES: OpcaoIcone[] = REDES;
export const OPCOES_ICONES_HABILIDADES: OpcaoIcone[] = [...TECNOLOGIAS, ...GERAIS, ...REDES.filter((r) => r.valor === "github")];

export const ICONES: Record<string, IconType> = Object.fromEntries(
  [...REDES, ...TECNOLOGIAS, ...GERAIS].map((o) => [o.valor, o.componente]),
);

export const ICONE_PADRAO: IconType = FaCode;
