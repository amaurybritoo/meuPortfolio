import { FaArrowDown, FaArrowUp, FaClone, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { novaMidia, novoProjeto, novoTeste } from "../../../data/padrao";
import type { Projeto } from "../../../tipos";
import { gerarId, slugUnico } from "../../../utilitarios/texto";
import { moverItem, removerItem } from "../../../utilitarios/lista";
import { BotoesItem, Bloco, CampoArea, CampoTexto, ConfirmarExclusao, Interruptor, ListaTextos, SeletorImagem, SeletorOpcao, SeletorVideo, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function ProjetosAba({ dados, atualizar, projetoSelecionado: selecionadoId, aoSelecionarProjeto: setSelecionadoId }: PropsAba) {
  const indice = Math.max(0, dados.projetos.findIndex((p) => p.id === selecionadoId));
  const projeto: Projeto | undefined = dados.projetos[indice];
  const categorias = Array.from(new Set(dados.projetos.map((p) => p.categoria).filter(Boolean)));
  const alterar = (fn: (p: Projeto) => void) => atualizar((d) => fn(d.projetos[indice]));
  const projetosDisponiveis = dados.projetos.filter((p) => {
    if (p.id === projeto?.id || p.colecao) return false;
    const outraColecao = dados.projetos.find((outro) => outro.id !== projeto?.id && outro.colecao && outro.projetosRelacionados.includes(p.id));
    return !outraColecao || projeto?.projetosRelacionados.includes(p.id);
  });

  const adicionar = () => {
    const novo = novoProjeto();
    atualizar((d) => { d.projetos.push(novo); });
    setSelecionadoId(novo.id);
  };

  const duplicar = (i: number) => {
    const copia: Projeto = { ...structuredClone(dados.projetos[i]), id: gerarId("proj"), nome: `${dados.projetos[i].nome} (cópia)`, slug: `${dados.projetos[i].slug}-copia-${Date.now().toString(36).slice(-3)}`, visivel: false };
    atualizar((d) => { d.projetos.splice(i + 1, 0, copia); });
    setSelecionadoId(copia.id);
  };

  const excluir = (i: number) => {
    atualizar((d) => removerItem(d.projetos, i));
    setSelecionadoId(dados.projetos[i === 0 ? 1 : i - 1]?.id ?? "");
  };

  return (
    <>
      <TituloAba titulo="Projetos" descricao="Cada projeto vira um card na página inicial e uma página de detalhes. Projetos desmarcados em “Publicado no site” ficam como rascunho." />

      <div className="projetos-admin">
        <aside className="projetos-lista" aria-label="Lista de projetos">
          <ul>
            {dados.projetos.map((p, i) => (
              <li key={p.id} className={p.id === projeto?.id ? "ativo" : ""}>
                <button type="button" className="projetos-lista-item" onClick={() => setSelecionadoId(p.id)} aria-current={p.id === projeto?.id}>
                  <span className="projetos-lista-miniatura">{p.capa ? <img src={p.capa} alt="" /> : <span aria-hidden="true">{p.nome.slice(0, 1) || "?"}</span>}</span>
                  <span className="projetos-lista-texto">
                    <strong>{p.nome || "(sem nome)"}</strong>
                    <small className={p.visivel ? "selo selo-ok" : "selo selo-rascunho"}>{p.visivel ? "Publicado" : "Rascunho"}</small>
                  </span>
                </button>
                <div className="projetos-lista-acoes">
                  <button type="button" className="icone-botao" onClick={() => atualizar((d) => moverItem(d.projetos, i, -1))} disabled={i === 0} aria-label={`Subir ${p.nome}`}><FaArrowUp aria-hidden="true" /></button>
                  <button type="button" className="icone-botao" onClick={() => atualizar((d) => moverItem(d.projetos, i, 1))} disabled={i === dados.projetos.length - 1} aria-label={`Descer ${p.nome}`}><FaArrowDown aria-hidden="true" /></button>
                  <button type="button" className="icone-botao" onClick={() => duplicar(i)} aria-label={`Duplicar ${p.nome}`}><FaClone aria-hidden="true" /></button>
                  <ConfirmarExclusao rotulo={`o projeto “${p.nome || "sem nome"}”`} className="icone-botao icone-botao-perigo" ariaLabel={`Excluir ${p.nome}`} onConfirmar={() => excluir(i)}><FaTrash aria-hidden="true" /></ConfirmarExclusao>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" className="admin-botao admin-botao-primario" onClick={adicionar}><FaPlus aria-hidden="true" /> Novo projeto</button>
        </aside>

        {projeto ? (
          <section className="projetos-editor" aria-label={`Editar ${projeto.nome}`}>
            <div className="projetos-editor-topo">
              <h3>{projeto.nome || "Novo projeto"}</h3>
              <a className="admin-botao admin-botao-contorno admin-botao-pequeno" href={`/projeto/${projeto.slug}?preview=1`} target="_blank" rel="noopener noreferrer"><FaEye aria-hidden="true" /> Ver no site (prévia)</a>
            </div>

            <Bloco titulo="Informações" aberto resumo={projeto.categoria}>
              <CampoTexto
                rotulo="Nome do projeto"
                valor={projeto.nome}
                onChange={(v) => alterar((p) => {
                  // enquanto o endereço ainda é o "automático" do nome, ele acompanha o nome
                  const outros = dados.projetos.filter((x) => x.id !== p.id).map((x) => x.slug);
                  const automatico = !p.slug || p.slug === slugUnico(p.nome, outros) || /^(novo-projeto|projeto)(-\d+)?$/.test(p.slug);
                  if (automatico) p.slug = slugUnico(v, outros);
                  p.nome = v;
                })}
              />
              <div className="campo-com-botao">
                <CampoTexto rotulo="Endereço (slug)" dica={`O projeto abre em /projeto/${projeto.slug || "…"}`} valor={projeto.slug} onChange={(v) => alterar((p) => { p.slug = v.toLowerCase().replace(/[^a-z0-9-]+/g, "-"); })} />
                <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" onClick={() => alterar((p) => { p.slug = slugUnico(p.nome, dados.projetos.filter((x) => x.id !== p.id).map((x) => x.slug)); })}>Gerar do nome</button>
              </div>
              <div className="grade-campos">
                <div>
                  <CampoTexto rotulo="Categoria" dica="Cria o filtro automaticamente. Ex.: Front-end, QA / Testes." valor={projeto.categoria} onChange={(v) => alterar((p) => { p.categoria = v; })} />
                  {categorias.length > 0 && (
                    <div className="sugestoes" aria-label="Categorias já usadas">
                      {categorias.map((c) => <button key={c} type="button" className="chip chip-botao" onClick={() => alterar((p) => { p.categoria = c; })}>{c}</button>)}
                    </div>
                  )}
                </div>
                <CampoTexto rotulo="Ano" placeholder="2025" valor={projeto.ano} onChange={(v) => alterar((p) => { p.ano = v; })} />
              </div>
              <CampoArea rotulo="Resumo do card" dica={`${projeto.resumo.length}/200 caracteres. Aparece no card da página inicial.`} linhas={3} valor={projeto.resumo} onChange={(v) => alterar((p) => { p.resumo = v; })} />
              <CampoArea rotulo="Descrição completa" dica="Aparece na página do projeto. Use linhas em branco para separar parágrafos." linhas={8} valor={projeto.descricao} onChange={(v) => alterar((p) => { p.descricao = v; })} />
              <Interruptor rotulo="Publicado no site" dica="Desligado = rascunho: só aparece na prévia do admin." valor={projeto.visivel} onChange={(v) => alterar((p) => { p.visivel = v; })} />
              <Interruptor rotulo="Projeto em destaque" dica="Mostra uma etiqueta “Destaque” no card." valor={projeto.destaque} onChange={(v) => alterar((p) => { p.destaque = v; })} />
              <Interruptor rotulo="Este projeto é um conjunto" dica="Agrupa outros projetos em um único card na página inicial. Ao abrir, o visitante vê o título, a descrição e um card para cada projeto do conjunto." valor={projeto.colecao} onChange={(v) => alterar((p) => { p.colecao = v; if (!v) p.projetosRelacionados = []; })} />
              {projeto.colecao && <fieldset className="projetos-conjunto-selecao">
                <legend className="campo-rotulo">Quais projetos fazem parte?</legend>
                <p className="campo-dica">Os projetos marcados deixam de aparecer como cards separados e passam a ser explorados dentro deste conjunto. Um projeto em rascunho continua disponível aqui, mas não terá página individual.</p>
                {projetosDisponiveis.length ? projetosDisponiveis.map((item) => <label key={item.id} className="projetos-conjunto-opcao">
                  <input type="checkbox" checked={projeto.projetosRelacionados.includes(item.id)} onChange={(evento) => alterar((p) => { p.projetosRelacionados = evento.target.checked ? [...p.projetosRelacionados, item.id] : p.projetosRelacionados.filter((id) => id !== item.id); })} />
                  <span><strong>{item.nome || "(sem nome)"}</strong><small>{item.visivel ? (item.slug ? `/projeto/${item.slug}` : "Projeto sem endereço") : "Rascunho · aparece apenas neste conjunto"}</small></span>
                </label>) : <p className="campo-dica">Não há outros projetos disponíveis para incluir.</p>}
              </fieldset>}
            </Bloco>

            <Bloco titulo="Imagens" resumo={projeto.capa ? "com capa" : "sem capa"}>
              <SeletorImagem rotulo="Capa do card" dica="Formato horizontal (16:9) fica melhor. Ex.: print da página inicial do projeto." maxLado={1400} valor={projeto.capa} onChange={(v) => alterar((p) => { p.capa = v; })} />
              <SeletorImagem rotulo="Banner da página do projeto (opcional)" dica="Se não enviar um banner, nenhuma imagem será exibida no topo da página do projeto." maxLado={2560} qualidade={0.9} valor={projeto.banner} onChange={(v) => alterar((p) => { p.banner = v; })} />
            </Bloco>

            <Bloco titulo="Tecnologias" resumo={`${projeto.tecnologias.length} item(ns)`}>
              <ListaTextos rotulo="Tecnologias" itens={projeto.tecnologias} placeholder="Ex.: React" adicionar="Adicionar tecnologia" onChange={(itens) => alterar((p) => { p.tecnologias = itens; })} />
            </Bloco>

            <Bloco titulo="Links" resumo={[projeto.site && "site", projeto.github && "GitHub"].filter(Boolean).join(" · ")}>
              <CampoTexto rotulo="Site (online)" tipo="url" placeholder="https://" valor={projeto.site} onChange={(v) => alterar((p) => { p.site = v; })} />
              <CampoTexto rotulo="Repositório (GitHub)" tipo="url" placeholder="https://github.com/…" valor={projeto.github} onChange={(v) => alterar((p) => { p.github = v; })} />
            </Bloco>

            <Bloco titulo="Galeria de prints" resumo={`${projeto.prints.length} item(ns)`}>
              {projeto.prints.map((m, i) => (
                <div key={i} className="cartao-item cartao-item-grande">
                  <SeletorOpcao rotulo="Tipo" valor={m.tipo} opcoes={[{ valor: "img", rotulo: "Imagem" }, { valor: "video", rotulo: "Vídeo" }]} onChange={(v) => alterar((p) => { p.prints[i].tipo = v === "video" ? "video" : "img"; })} />
                  {m.tipo === "img" ? (
                    <SeletorImagem rotulo="Imagem" maxLado={2560} qualidade={0.9} valor={m.src} onChange={(v) => alterar((p) => { p.prints[i].src = v; })} />
                  ) : (
                    <SeletorVideo rotulo="Vídeo" dica="Envie MP4, WebM ou MOV de até 3,2 MB, ou cole um link direto para o vídeo." valor={m.src} onChange={(v) => alterar((p) => { p.prints[i].src = v; })} />
                  )}
                  <CampoTexto rotulo="Legenda" valor={m.legenda} onChange={(v) => alterar((p) => { p.prints[i].legenda = v; })} />
                  <BotoesItem indice={i} total={projeto.prints.length} rotuloItem={`print ${i + 1}`} onMover={(passo) => alterar((p) => moverItem(p.prints, i, passo))} onRemover={() => alterar((p) => removerItem(p.prints, i))} />
                </div>
              ))}
              <button type="button" className="admin-botao admin-botao-contorno" onClick={() => alterar((p) => { p.prints.push(novaMidia()); })}><FaPlus aria-hidden="true" /> Adicionar print</button>
            </Bloco>

            <Bloco titulo="Testes realizados" resumo={`${projeto.testes.length} item(ns)`}>
              <p className="campo-dica">Mostre como a qualidade foi verificada: casos de teste, relatórios, prints do Cypress etc.</p>
              {projeto.testes.map((t, i) => (
                <div key={i} className="cartao-item cartao-item-grande">
                  <CampoTexto rotulo="Nome do teste" valor={t.nome} onChange={(v) => alterar((p) => { p.testes[i].nome = v; })} />
                  <CampoArea rotulo="Descrição" linhas={2} valor={t.descricao} onChange={(v) => alterar((p) => { p.testes[i].descricao = v; })} />
                  <SeletorOpcao rotulo="Tipo de evidência" valor={t.video ? "video" : "img"} opcoes={[{ valor: "img", rotulo: "Imagem" }, { valor: "video", rotulo: "Vídeo" }]} onChange={(v) => alterar((p) => { if (v === "video") p.testes[i].imagem = ""; else p.testes[i].video = ""; })} />
                  {t.video ? (
                    <SeletorVideo rotulo="Vídeo de evidência" dica="Envie MP4, WebM ou MOV de até 3 MB, ou cole um link direto para o vídeo." valor={t.video} onChange={(v) => alterar((p) => { p.testes[i].video = v; })} />
                  ) : (
                    <SeletorImagem rotulo="Imagem de evidência (opcional)" maxLado={2560} qualidade={0.9} valor={t.imagem} onChange={(v) => alterar((p) => { p.testes[i].imagem = v; })} />
                  )}
                  <BotoesItem indice={i} total={projeto.testes.length} rotuloItem={`teste ${i + 1}`} onMover={(passo) => alterar((p) => moverItem(p.testes, i, passo))} onRemover={() => alterar((p) => removerItem(p.testes, i))} />
                </div>
              ))}
              <button type="button" className="admin-botao admin-botao-contorno" onClick={() => alterar((p) => { p.testes.push(novoTeste()); })}><FaPlus aria-hidden="true" /> Adicionar teste</button>
            </Bloco>

            <Bloco titulo="Desafios e soluções" resumo={`${projeto.desafios.length} / ${projeto.solucoes.length}`}>
              <ListaTextos rotulo="Desafios" itens={projeto.desafios} multilinha adicionar="Adicionar desafio" onChange={(itens) => alterar((p) => { p.desafios = itens; })} />
              <ListaTextos rotulo="Soluções" itens={projeto.solucoes} multilinha adicionar="Adicionar solução" onChange={(itens) => alterar((p) => { p.solucoes = itens; })} />
            </Bloco>
          </section>
        ) : (
          <p className="vazio">Nenhum projeto ainda. Clique em “Novo projeto”.</p>
        )}
      </div>
    </>
  );
}
