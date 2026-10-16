import { useState } from "react";
import Dragao from "../../../componentes/dragao/Dragao";
import { DRAGAO_PADRAO } from "../../../data/padrao";
import { Deslizante, Interruptor, SeletorCor, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function AparenciaAba({ dados, atualizar }: PropsAba) {
  const a = dados.aparencia;
  const dragao = a.dragao;
  const [realcar, setRealcar] = useState(true);

  return (
    <>
      <TituloAba titulo="Aparência e dragão" descricao="Cores do site e o dragão que voa ao fundo, sem atrapalhar a leitura." />

      <div className="painel-cartao">
        <h3>Cores</h3>
        <div className="grade-campos">
          <SeletorCor rotulo="Cor principal" dica="Botões, destaques e brilhos." valor={a.corPrimaria} onChange={(v) => atualizar((d) => { d.aparencia.corPrimaria = v; })} />
          <SeletorCor rotulo="Cor secundária" dica="Detalhes e foco do teclado." valor={a.corSecundaria} onChange={(v) => atualizar((d) => { d.aparencia.corSecundaria = v; })} />
        </div>
        <Interruptor rotulo="Brilhos suaves no fundo" valor={a.brilhoFundo} onChange={(v) => atualizar((d) => { d.aparencia.brilhoFundo = v; })} />
      </div>

      <div className="painel-cartao">
        <h3>Dragão</h3>
        <Interruptor rotulo="Mostrar o dragão voando" dica="Ele cruza a tela de tempos em tempos, fica atrás do texto e não recebe cliques. Quem usa 'reduzir animações' no aparelho não o vê." valor={dragao.ativo} onChange={(v) => atualizar((d) => { d.aparencia.dragao.ativo = v; })} />
        {dragao.ativo && (
          <>
            <div className="previa-dragao" aria-label="Prévia do dragão">
              <Dragao modo="previa" config={realcar ? { ...dragao, opacidade: Math.max(dragao.opacidade, 0.85) } : dragao} />
            </div>
            <Interruptor rotulo="Realçar na prévia (só aqui no admin)" dica="No site ele fica bem mais discreto, com a opacidade que você escolher abaixo." valor={realcar} onChange={setRealcar} />
            <div className="grade-campos">
              <Deslizante rotulo="Intensidade (opacidade)" dica="Menor = mais discreto. Recomendado: 12% a 25%." min={0.05} max={0.4} passo={0.01} valor={dragao.opacidade} formatar={(v) => `${Math.round(v * 100)}%`} onChange={(v) => atualizar((d) => { d.aparencia.dragao.opacidade = v; })} />
              <Deslizante rotulo="Velocidade do voo" min={0.4} max={2} passo={0.1} valor={dragao.velocidade} formatar={(v) => `${v.toFixed(1)}x`} onChange={(v) => atualizar((d) => { d.aparencia.dragao.velocidade = v; })} />
              <Deslizante rotulo="Tamanho" min={0.5} max={1.6} passo={0.05} valor={dragao.tamanho} formatar={(v) => `${Math.round(v * 100)}%`} onChange={(v) => atualizar((d) => { d.aparencia.dragao.tamanho = v; })} />
              <Deslizante rotulo="Pausa entre voos" dica="0 = voa sem parar." min={0} max={60} passo={1} valor={dragao.intervalo} formatar={(v) => (v === 0 ? "sem pausa" : `${v}s`)} onChange={(v) => atualizar((d) => { d.aparencia.dragao.intervalo = v; })} />
              <SeletorCor rotulo="Cor do traço" valor={dragao.cor} onChange={(v) => atualizar((d) => { d.aparencia.dragao.cor = v; })} />
            </div>
            <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" onClick={() => atualizar((d) => { d.aparencia.dragao = { ...DRAGAO_PADRAO }; })}>
              Restaurar configurações do dragão
            </button>
          </>
        )}
      </div>
    </>
  );
}
