import { FaPlus } from "react-icons/fa";
import { novaFormacao } from "../../../data/padrao";
import { moverItem, removerItem } from "../../../utilitarios/lista";
import { BotoesItem, CampoArea, CampoTexto, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function FormacaoAba({ dados, atualizar }: PropsAba) {
  return <>
    <TituloAba titulo="Formação" descricao="Gerencie cursos, graduações e especializações exibidos no portfólio e no currículo." />
    {dados.formacoes.map((f, i) => <div key={f.id} className="cartao-item cartao-item-grande">
      <div className="grade-campos">
        <CampoTexto rotulo="Período" placeholder="2023 – atual" valor={f.periodo} onChange={(v) => atualizar((d) => { d.formacoes[i].periodo = v; })} />
        <CampoTexto rotulo="Instituição" valor={f.local} onChange={(v) => atualizar((d) => { d.formacoes[i].local = v; })} />
      </div>
      <CampoTexto rotulo="Curso / formação" valor={f.titulo} onChange={(v) => atualizar((d) => { d.formacoes[i].titulo = v; })} />
      <CampoArea rotulo="Descrição" linhas={3} valor={f.descricao} onChange={(v) => atualizar((d) => { d.formacoes[i].descricao = v; })} />
      <BotoesItem indice={i} total={dados.formacoes.length} rotuloItem={`formação ${i + 1}`} onMover={(p) => atualizar((d) => moverItem(d.formacoes, i, p))} onRemover={() => atualizar((d) => removerItem(d.formacoes, i))} />
    </div>)}
    <button type="button" className="admin-botao admin-botao-contorno" onClick={() => atualizar((d) => { d.formacoes.push(novaFormacao()); })}><FaPlus aria-hidden="true" /> Adicionar formação</button>
  </>;
}
