import { usePortfolio } from "../contexto/usePortfolio";
import { useSeo } from "../componentes/comuns/useSeo";
import Contato from "../componentes/home/Contato";
import Experiencia from "../componentes/home/Experiencia";
import Habilidades from "../componentes/home/Habilidades";
import Hero from "../componentes/home/Hero";
import Projetos from "../componentes/home/Projetos";
import Sobre from "../componentes/home/Sobre";
import PaginaBase from "../componentes/layout/PaginaBase";

export default function Home() {
  const { dados } = usePortfolio();
  useSeo(dados.seo.titulo, dados.seo.descricao);
  return (
    <PaginaBase>
      <Hero />
      <Sobre />
      <Habilidades />
      <Projetos />
      <Experiencia />
      <Contato />
    </PaginaBase>
  );
}
