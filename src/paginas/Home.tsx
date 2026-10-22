import { lazy, Suspense } from "react";
import { usePortfolio } from "../contexto/usePortfolio";
import { useSeo } from "../componentes/comuns/useSeo";
import Hero from "../componentes/home/Hero";
import PaginaBase from "../componentes/layout/PaginaBase";

// Carrega o restante da página sem bloquear a apresentação inicial.
const HomeAbaixoDaDobra = lazy(() => import("../componentes/home/HomeAbaixoDaDobra"));

export default function Home() {
  const { dados } = usePortfolio();
  useSeo(dados.seo.titulo, dados.seo.descricao);
  return (
    <PaginaBase>
      <Hero />
      <Suspense fallback={null}>
        <HomeAbaixoDaDobra />
      </Suspense>
    </PaginaBase>
  );
}
