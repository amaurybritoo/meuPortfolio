import { FaPlus } from "react-icons/fa";
import { novaRede } from "../../../data/padrao";
import { OPCOES_ICONES_REDES } from "../../../utilitarios/icones";
import { moverItem, removerItem } from "../../../utilitarios/lista";
import { somenteDigitos } from "../../../utilitarios/texto";
import { BotoesItem, Bloco, CampoArea, CampoTexto, Interruptor, ListaTextos, SeletorArquivo, SeletorIcone, SeletorImagem, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function PerfilAba({ dados, atualizar }: PropsAba) {
  const p = dados.perfil;
  return (
    <>
      <TituloAba titulo="Perfil" descricao="Seus dados principais: aparecem no topo do site, no menu, no rodapé e na seção de contato." />

      <Bloco titulo="Identidade" resumo={p.nome} aberto>
        <CampoTexto rotulo="Nome" valor={p.nome} onChange={(v) => atualizar((d) => { d.perfil.nome = v; })} />
        <ListaTextos
          rotulo="Cargos"
          dica="Aparecem alternando embaixo do seu nome. Ex.: Front-end Developer, QA Engineer."
          itens={p.cargos}
          onChange={(itens) => atualizar((d) => { d.perfil.cargos = itens; })}
          adicionar="Adicionar cargo"
        />
        <CampoArea rotulo="Frase principal" dica="A frase logo abaixo do nome, no topo do site." linhas={2} valor={p.frase} onChange={(v) => atualizar((d) => { d.perfil.frase = v; })} />
        <CampoArea rotulo="Resumo" dica="Usado como apresentação curta se você não escrever os parágrafos da aba Sobre." linhas={3} valor={p.resumo} onChange={(v) => atualizar((d) => { d.perfil.resumo = v; })} />
        <CampoTexto rotulo="Localização" dica="Opcional. Ex.: Manaus, AM. Fica vazio = não aparece." valor={p.localizacao} onChange={(v) => atualizar((d) => { d.perfil.localizacao = v; })} />
        <CampoTexto rotulo="Frase do rodapé" valor={p.rodape} onChange={(v) => atualizar((d) => { d.perfil.rodape = v; })} />
      </Bloco>

      <Bloco titulo="Imagens" resumo="Foto e logo" aberto>
        <SeletorImagem rotulo="Foto do topo" dica="Ideal: foto com fundo transparente (PNG/WebP), de corpo ou meio corpo." maxLado={1200} valor={p.foto} onChange={(v) => atualizar((d) => { d.perfil.foto = v; })} />
        <SeletorImagem rotulo="Logo" dica="Aparece no menu, no rodapé e esmaecida atrás da foto." maxLado={512} valor={p.logo} onChange={(v) => atualizar((d) => { d.perfil.logo = v; })} />
      </Bloco>

      <Bloco titulo="Disponibilidade e currículo">
        <Interruptor rotulo="Mostrar selo de disponibilidade" valor={p.disponivel} onChange={(v) => atualizar((d) => { d.perfil.disponivel = v; })} />
        <CampoTexto rotulo="Texto do selo" valor={p.textoDisponibilidade} onChange={(v) => atualizar((d) => { d.perfil.textoDisponibilidade = v; })} />
        <SeletorArquivo rotulo="Currículo (PDF)" dica="Opcional. Quando preenchido, aparecem botões de download no site." valor={p.curriculo} onChange={(v) => atualizar((d) => { d.perfil.curriculo = v; })} />
      </Bloco>

      <Bloco titulo="Contatos" resumo={p.email}>
        <CampoTexto rotulo="E-mail" tipo="email" valor={p.email} onChange={(v) => atualizar((d) => { d.perfil.email = v; })} />
        <CampoTexto
          rotulo="WhatsApp"
          tipo="tel"
          dica="Só números, com DDI e DDD. Ex.: 5592999999999"
          valor={p.whatsapp}
          onChange={(v) => atualizar((d) => { d.perfil.whatsapp = somenteDigitos(v); })}
        />
      </Bloco>

      <Bloco titulo="Redes sociais" resumo={`${p.redes.length} link(s)`}>
        {p.redes.map((rede, i) => (
          <div key={rede.id} className="cartao-item">
            <div className="grade-campos">
              <CampoTexto rotulo="Nome" valor={rede.rotulo} onChange={(v) => atualizar((d) => { d.perfil.redes[i].rotulo = v; })} />
              <SeletorIcone rotulo="Ícone" valor={rede.icone} opcoes={OPCOES_ICONES_REDES} onChange={(v) => atualizar((d) => { d.perfil.redes[i].icone = v; })} />
            </div>
            <CampoTexto rotulo="Link" tipo="url" placeholder="https://" valor={rede.url} onChange={(v) => atualizar((d) => { d.perfil.redes[i].url = v; })} />
            <BotoesItem indice={i} total={p.redes.length} rotuloItem={`rede ${rede.rotulo || i + 1}`} onMover={(passo) => atualizar((d) => moverItem(d.perfil.redes, i, passo))} onRemover={() => atualizar((d) => removerItem(d.perfil.redes, i))} />
          </div>
        ))}
        <button type="button" className="admin-botao admin-botao-contorno" onClick={() => atualizar((d) => { d.perfil.redes.push(novaRede()); })}>
          <FaPlus aria-hidden="true" /> Adicionar rede social
        </button>
      </Bloco>
    </>
  );
}
