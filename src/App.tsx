import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollAoTrocarRota from "./componentes/layout/ScrollAoTrocarRota";
import PortfolioProvider from "./contexto/PortfolioProvider";
import NaoEncontrado from "./paginas/NaoEncontrado";
const Home = lazy(() => import("./paginas/Home"));
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

export default function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <ScrollAoTrocarRota />
        <Suspense fallback={<TelaCarregamento />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projeto/:slug" element={<Projeto />} />
            <Route path="/curriculo" element={<Curriculo />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Routes>
        </Suspense>
      </PortfolioProvider>
    </BrowserRouter>
  );
}
