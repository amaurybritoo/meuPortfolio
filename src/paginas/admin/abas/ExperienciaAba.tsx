import { FaPlus } from "react-icons/fa";
import { novaExperiencia } from "../../../data/padrao";
import { moverItem, removerItem } from "../../../utilitarios/lista";
import { BotoesItem, CampoArea, CampoTexto, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function ExperienciaAba({ dados, atualizar }: PropsAba) {
  return (
    <>
      <TituloAba titulo="Experiência profissional" descricao="Gerencie seus cargos e experiências de trabalho." />
      {dados.experiencias.map((e, i) => (
        <div key={e.id} className="cartao-item cartao-item-grande">
          <div className="grade-campos">
            <CampoTexto rotulo="Período" placeholder="2023 – atual" valor={e.periodo} onChange={(v) => atualizar((d) => { d.experiencias[i].periodo = v; })} />
            <CampoTexto rotulo="Local / empresa" valor={e.local} onChange={(v) => atualizar((d) => { d.experiencias[i].local = v; })} />
          </div>
          <CampoTexto rotulo="Título / cargo / curso" valor={e.titulo} onChange={(v) => atualizar((d) => { d.experiencias[i].titulo = v; })} />
          <CampoArea rotulo="Descrição" linhas={3} valor={e.descricao} onChange={(v) => atualizar((d) => { d.experiencias[i].descricao = v; })} />
          <BotoesItem indice={i} total={dados.experiencias.length} rotuloItem={`experiência ${i + 1}`} onMover={(p) => atualizar((d) => moverItem(d.experiencias, i, p))} onRemover={() => atualizar((d) => removerItem(d.experiencias, i))} />
        </div>
      ))}
      <button type="button" className="admin-botao admin-botao-contorno" onClick={() => atualizar((d) => { d.experiencias.push(novaExperiencia()); })}>
        <FaPlus aria-hidden="true" /> Adicionar item
      </button>
    </>
  );
}
