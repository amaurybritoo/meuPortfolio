import Navbar from "../componentes/Navbar";
import Hero from "../componentes/Hero";
import Projetos from "../componentes/Projetos";
import Contato from "../componentes/Contato";
import Rodape from "../componentes/Rodape";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Projetos />
      <Contato /> 
      <Rodape />
    </>
  );
}