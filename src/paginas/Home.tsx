import { lazy, Suspense } from "react";
import { usePortfolio } from "../contexto/usePortfolio";
import { useSeo } from "../componentes/comuns/useSeo";
import Hero from "../componentes/home/Hero";
import PaginaBase from "../componentes/layout/PaginaBase";

// Baixa as seções abaixo da primeira dobra em paralelo, sem atrasar o Hero.
const secoesPromise = import("../componentes/home/HomeAbaixoDaDobra");
const HomeAbaixoDaDobra = lazy(() => secoesPromise);

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
