import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollAoTrocarRota from "./componentes/layout/ScrollAoTrocarRota";
import PortfolioProvider from "./contexto/PortfolioProvider";
import Home from "./paginas/Home";
import NaoEncontrado from "./paginas/NaoEncontrado";
import Projeto from "./paginas/Projeto";

// O painel de administração só é baixado quando alguém abre /admin (mantém o site público leve).
const Admin = lazy(() => import("./paginas/Admin"));

export default function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <ScrollAoTrocarRota />
        <Suspense fallback={<div className="carregando" role="status">Carregando…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projeto/:slug" element={<Projeto />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Routes>
        </Suspense>
      </PortfolioProvider>
    </BrowserRouter>
  );
}
