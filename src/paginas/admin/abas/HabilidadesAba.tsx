import { FaPlus } from "react-icons/fa";
import { novaHabilidade, novoGrupo } from "../../../data/padrao";
import { OPCOES_ICONES_HABILIDADES } from "../../../utilitarios/icones";
import { moverItem, removerItem } from "../../../utilitarios/lista";
import { BotoesItem, Bloco, CampoTexto, ConfirmarExclusao, SeletorIcone, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function HabilidadesAba({ dados, atualizar }: PropsAba) {
  return (
    <>
      <TituloAba titulo="Habilidades" descricao="Grupos de tecnologias e práticas. Cada grupo vira um cartão no site." />
      {dados.habilidades.map((grupo, g) => (
        <Bloco key={grupo.id} titulo={grupo.titulo || "Grupo sem nome"} resumo={`${grupo.itens.length} item(ns)`} aberto={g === 0}>
          <CampoTexto rotulo="Nome do grupo" valor={grupo.titulo} onChange={(v) => atualizar((d) => { d.habilidades[g].titulo = v; })} />
          {grupo.itens.map((item, i) => (
            <div key={item.id} className="cartao-item">
              <div className="grade-campos">
                <CampoTexto rotulo="Habilidade" valor={item.nome} onChange={(v) => atualizar((d) => { d.habilidades[g].itens[i].nome = v; })} />
                <SeletorIcone rotulo="Ícone" valor={item.icone} opcoes={OPCOES_ICONES_HABILIDADES} onChange={(v) => atualizar((d) => { d.habilidades[g].itens[i].icone = v; })} />
              </div>
              <BotoesItem indice={i} total={grupo.itens.length} rotuloItem={`habilidade ${item.nome || i + 1}`} onMover={(p) => atualizar((d) => moverItem(d.habilidades[g].itens, i, p))} onRemover={() => atualizar((d) => removerItem(d.habilidades[g].itens, i))} />
            </div>
          ))}
          <div className="acoes-linha">
            <button type="button" className="admin-botao admin-botao-contorno admin-botao-pequeno" onClick={() => atualizar((d) => { d.habilidades[g].itens.push(novaHabilidade()); })}>
              <FaPlus aria-hidden="true" /> Adicionar habilidade
            </button>
            <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" disabled={g === 0} onClick={() => atualizar((d) => moverItem(d.habilidades, g, -1))}>Subir grupo</button>
            <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" disabled={g === dados.habilidades.length - 1} onClick={() => atualizar((d) => moverItem(d.habilidades, g, 1))}>Descer grupo</button>
            <ConfirmarExclusao rotulo={`o grupo “${grupo.titulo || "sem nome"}” e todas as habilidades dele`} className="admin-botao admin-botao-perigo admin-botao-pequeno" ariaLabel={`Remover grupo ${grupo.titulo}`} onConfirmar={() => atualizar((d) => removerItem(d.habilidades, g))}>Remover grupo</ConfirmarExclusao>
          </div>
        </Bloco>
      ))}
      <button type="button" className="admin-botao admin-botao-contorno" onClick={() => atualizar((d) => { d.habilidades.push(novoGrupo()); })}>
        <FaPlus aria-hidden="true" /> Adicionar grupo
      </button>
    </>
  );
}
