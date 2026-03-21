import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Projeto from "./paginas/Projeto";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:slug" element={<Projeto />} />
      </Routes>
    </BrowserRouter>
  );
}