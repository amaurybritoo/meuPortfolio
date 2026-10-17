import { lazy, Suspense, useEffect } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollAoTrocarRota from "./componentes/layout/ScrollAoTrocarRota";
import PortfolioProvider from "./contexto/PortfolioProvider";
import Home from "./paginas/Home";
import NaoEncontrado from "./paginas/NaoEncontrado";
import { ocultarTelaCarregamento } from "./utilitarios/telaCarregamento";
const Projeto = lazy(() => import("./paginas/Projeto"));
const Curriculo = lazy(() => import("./paginas/Curriculo"));

// O painel de administração só é baixado quando alguém abre /admin (mantém o site público leve).
const Admin = lazy(() => import("./paginas/Admin"));

function TelaCarregamento() {
  return (
    <div className="inicio-carregando" role="status" aria-label="Carregando portfólio">
      <div className="inicio-carregando-conteudo">
        <img className="inicio-carregando-logo" src="/logo.webp" width="190" height="190" alt="Logo de Amaury Brito" />
        <span className="inicio-carregando-status" aria-label="Carregando">Carregando</span>
      </div>
    </div>
  );
}

function PaginaPronta({ children }: { children: ReactNode }) {
  useEffect(() => {
    const inicio = performance.now();
    let concluido = false;
    let timer = 0;
    let quadro1 = 0;
    let quadro2 = 0;
    const imagem = document.querySelector<HTMLImageElement>("#root .hero-foto, #root .projeto-banner img");

    const revelar = () => {
      if (concluido) return;
      concluido = true;
      if (timer) window.clearTimeout(timer);
      const espera = Math.max(0, 220 - (performance.now() - inicio));
      timer = window.setTimeout(() => {
        quadro1 = window.requestAnimationFrame(() => {
          quadro2 = window.requestAnimationFrame(ocultarTelaCarregamento);
        });
      }, espera);
    };

    if (imagem && !imagem.complete) {
      imagem.addEventListener("load", revelar, { once: true });
      imagem.addEventListener("error", revelar, { once: true });
      timer = window.setTimeout(revelar, 5000);
    } else {
      revelar();
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      window.cancelAnimationFrame(quadro1);
      window.cancelAnimationFrame(quadro2);
      imagem?.removeEventListener("load", revelar);
      imagem?.removeEventListener("error", revelar);
    };
  }, []);

  return children;
}

function BloquearZoomNaHome() {
  useEffect(() => {
    const bloquearGestos = (evento: Event) => {
      if (window.location.pathname !== "/" || (evento.target instanceof Element && evento.target.closest(".lightbox"))) return;
      if (evento.cancelable) evento.preventDefault();
    };
    const bloquearPinça = (evento: TouchEvent) => {
      if (evento.touches.length > 1) bloquearGestos(evento);
    };
    const conteudo = document.querySelector("#conteudo");
    conteudo?.classList.add("zoom-home-bloqueado");
    document.addEventListener("touchmove", bloquearPinça, { passive: false });
    document.addEventListener("gesturestart", bloquearGestos, { passive: false });
    document.addEventListener("gesturechange", bloquearGestos, { passive: false });
    return () => {
      conteudo?.classList.remove("zoom-home-bloqueado");
      document.removeEventListener("touchmove", bloquearPinça);
      document.removeEventListener("gesturestart", bloquearGestos);
      document.removeEventListener("gesturechange", bloquearGestos);
    };
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <BloquearZoomNaHome />
      <PortfolioProvider>
        <ScrollAoTrocarRota />
        <Suspense fallback={<TelaCarregamento />}>
          <Routes>
            <Route path="/" element={<PaginaPronta><Home /></PaginaPronta>} />
            <Route path="/projeto/:slug" element={<PaginaPronta><Projeto /></PaginaPronta>} />
            <Route path="/curriculo" element={<PaginaPronta><Curriculo /></PaginaPronta>} />
            <Route path="/admin" element={<PaginaPronta><Admin /></PaginaPronta>} />
            <Route path="*" element={<PaginaPronta><NaoEncontrado /></PaginaPronta>} />
          </Routes>
        </Suspense>
      </PortfolioProvider>
    </BrowserRouter>
  );
}
