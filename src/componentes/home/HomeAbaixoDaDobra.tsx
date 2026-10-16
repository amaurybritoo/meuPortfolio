import Contato from "./Contato";
import Experiencia from "./Experiencia";
import Habilidades from "./Habilidades";
import Projetos from "./Projetos";
import Sobre from "./Sobre";

/** Seções completas da página inicial, separadas para o Hero aparecer primeiro. */
export default function HomeAbaixoDaDobra() {
  return (
    <>
      <Sobre />
      <Habilidades />
      <Projetos />
      <Experiencia />
      <Contato />
    </>
  );
}
