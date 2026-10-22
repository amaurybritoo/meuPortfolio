import type { ReactNode } from "react";
import BannerPreview from "./BannerPreview";
import BotaoTopo from "./BotaoTopo";
import FundoSite from "./FundoSite";
import Navbar from "./Navbar";
import Rodape from "./Rodape";

/** Estrutura comum de todas as páginas públicas. */
export default function PaginaBase({ children }: { children: ReactNode }) {
  return (
    <>
      <FundoSite />
      <BannerPreview />
      <Navbar />
      <main id="conteudo" className="conteudo-site" tabIndex={-1}>
        {children}
      </main>
      <Rodape />
      <BotaoTopo />
    </>
  );
}
