import type { Secoes } from "../../../tipos";
import { CampoTexto, Interruptor, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

const NOMES: Array<{ chave: keyof Secoes; nome: string; nota: string }> = [
  { chave: "sobre", nome: "Sobre mim", nota: "Só aparece se houver texto (abas Perfil/Sobre)." },
  { chave: "habilidades", nome: "Habilidades", nota: "Só aparece se houver grupos com itens." },
  { chave: "projetos", nome: "Projetos", nota: "Só aparece se houver projeto visível." },
  { chave: "formacao", nome: "Formação", nota: "Só aparece se houver formações." },
  { chave: "contato", nome: "Contato", nota: "" },
];

export default function SecoesAba({ dados, atualizar }: PropsAba) {
  return (
    <>
      <TituloAba titulo="Seções do site" descricao="Ligue ou desligue cada seção e escolha os títulos que aparecem." />
      {NOMES.map(({ chave, nome, nota }) => {
        const s = dados.secoes[chave];
        return (
          <div key={chave} className="painel-cartao">
            <Interruptor rotulo={`Mostrar "${nome}"`} dica={nota} valor={s.ativa} onChange={(v) => atualizar((d) => { d.secoes[chave].ativa = v; })} />
            <div className="grade-campos">
              <CampoTexto rotulo="Título" valor={s.titulo} onChange={(v) => atualizar((d) => { d.secoes[chave].titulo = v; })} />
              <CampoTexto rotulo="Subtítulo" valor={s.subtitulo} onChange={(v) => atualizar((d) => { d.secoes[chave].subtitulo = v; })} />
            </div>
          </div>
        );
      })}
    </>
  );
}
