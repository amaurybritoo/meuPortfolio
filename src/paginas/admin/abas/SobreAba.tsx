import { Bloco, CampoArea, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function SobreAba({ dados, atualizar }: PropsAba) {
  return (
    <>
      <TituloAba titulo="Sobre mim" descricao="Escreva sua apresentação em um único campo." />
      <Bloco titulo="Texto de apresentação" aberto>
        <CampoArea
          rotulo="Apresentação"
          dica="Use linhas em branco para separar parágrafos. Aceita Markdown e HTML seguro."
          valor={dados.perfil.sobre.join("\n\n")}
          linhas={12}
          markdown={false}
          onChange={(texto) => atualizar((d) => { d.perfil.sobre = texto.trim() ? [texto] : []; })}
        />
      </Bloco>
    </>
  );
}
