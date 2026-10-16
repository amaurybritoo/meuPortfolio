import { FaPlus } from "react-icons/fa";
import { novaEstatistica } from "../../../data/padrao";
import { moverItem, removerItem } from "../../../utilitarios/lista";
import { BotoesItem, Bloco, CampoTexto, ListaTextos, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function SobreAba({ dados, atualizar }: PropsAba) {
  return (
    <>
      <TituloAba titulo="Sobre mim" descricao="Sua apresentação e os números de destaque." />
      <Bloco titulo="Texto de apresentação" aberto resumo={`${dados.perfil.sobre.length} parágrafo(s)`}>
        <ListaTextos
          rotulo="Parágrafos"
          dica="Cada item vira um parágrafo da seção Sobre mim."
          itens={dados.perfil.sobre}
          multilinha
          adicionar="Adicionar parágrafo"
          onChange={(itens) => atualizar((d) => { d.perfil.sobre = itens; })}
        />
      </Bloco>
      <Bloco titulo="Números de destaque" resumo={`${dados.estatisticas.length} item(ns)`}>
        <p className="campo-dica">Opcional. Aparecem em cartões abaixo do topo (ex.: "3 | projetos entregues"). Sem itens, a faixa não aparece.</p>
        {dados.estatisticas.map((e, i) => (
          <div key={e.id} className="cartao-item">
            <div className="grade-campos">
              <CampoTexto rotulo="Número" placeholder="3+" valor={e.valor} onChange={(v) => atualizar((d) => { d.estatisticas[i].valor = v; })} />
              <CampoTexto rotulo="Descrição" placeholder="Projetos entregues" valor={e.rotulo} onChange={(v) => atualizar((d) => { d.estatisticas[i].rotulo = v; })} />
            </div>
            <BotoesItem indice={i} total={dados.estatisticas.length} rotuloItem={`número ${i + 1}`} onMover={(p) => atualizar((d) => moverItem(d.estatisticas, i, p))} onRemover={() => atualizar((d) => removerItem(d.estatisticas, i))} />
          </div>
        ))}
        <button type="button" className="admin-botao admin-botao-contorno" onClick={() => atualizar((d) => { d.estatisticas.push(novaEstatistica()); })}>
          <FaPlus aria-hidden="true" /> Adicionar número
        </button>
      </Bloco>
    </>
  );
}
