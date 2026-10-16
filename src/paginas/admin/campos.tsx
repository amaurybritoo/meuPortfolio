import { useId, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { ICONES, ICONE_PADRAO } from "../../utilitarios/icones";
import type { OpcaoIcone } from "../../utilitarios/icones";
import { comprimirImagem, ehDataUrl, tamanhoAproximadoKb } from "../../utilitarios/imagem";
import { moverItem, removerItem } from "../../utilitarios/lista";

// ---------- campos simples ----------

interface CampoBase {
  rotulo: string;
  dica?: string;
}

export function Campo({ rotulo, dica, children, id }: CampoBase & { children: ReactNode; id?: string }) {
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>{rotulo}</label>
      {children}
      {dica && <small className="campo-dica">{dica}</small>}
    </div>
  );
}

interface PropsTexto extends CampoBase {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  tipo?: "text" | "email" | "url" | "tel";
  maxLength?: number;
  markdown?: boolean;
}

export function CampoTexto({ rotulo, dica, valor, onChange, placeholder, tipo = "text", maxLength }: PropsTexto) {
  const id = useId();
  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <input id={id} className="entrada" type={tipo} value={valor} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />
    </Campo>
  );
}

export function CampoArea({ rotulo, dica, valor, onChange, placeholder, linhas = 4, markdown = true }: PropsTexto & { linhas?: number }) {
  const id = useId();
  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <textarea id={id} className="entrada" rows={linhas} value={valor} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {markdown && <small className="campo-dica">Markdown: **negrito**, *itálico*, # título, - lista, `código` e [link](https://…). </small>}
    </Campo>
  );
}

export function Interruptor({ rotulo, dica, valor, onChange }: CampoBase & { valor: boolean; onChange: (valor: boolean) => void }) {
  const id = useId();
  return (
    <div className="campo campo-interruptor">
      <label className="interruptor" htmlFor={id}>
        <input id={id} type="checkbox" role="switch" checked={valor} onChange={(e) => onChange(e.target.checked)} />
        <span className="interruptor-trilho" aria-hidden="true" />
        <span className="interruptor-texto">{rotulo}</span>
      </label>
      {multilinha && <small className="campo-dica">Markdown: **negrito**, *itálico*, # título, - lista, `código` e [link](https://…). </small>}
      {dica && <small className="campo-dica">{dica}</small>}
    </div>
  );
}

export function Deslizante({ rotulo, dica, valor, onChange, min, max, passo, formatar }: CampoBase & {
  valor: number; onChange: (valor: number) => void; min: number; max: number; passo: number; formatar?: (v: number) => string;
}) {
  const id = useId();
  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <div className="deslizante">
        <input id={id} type="range" min={min} max={max} step={passo} value={valor} onChange={(e) => onChange(Number(e.target.value))} />
        <output htmlFor={id}>{formatar ? formatar(valor) : valor}</output>
      </div>
    </Campo>
  );
}

export function SeletorCor({ rotulo, dica, valor, onChange }: CampoBase & { valor: string; onChange: (valor: string) => void }) {
  const id = useId();
  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <div className="seletor-cor">
        <input id={id} type="color" value={valor} onChange={(e) => onChange(e.target.value)} />
        <input className="entrada" type="text" value={valor} aria-label={`${rotulo} (código hexadecimal)`} maxLength={7} onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && onChange(e.target.value)} />
      </div>
    </Campo>
  );
}

export function SeletorOpcao({ rotulo, dica, valor, onChange, opcoes }: CampoBase & { valor: string; onChange: (valor: string) => void; opcoes: Array<{ valor: string; rotulo: string }> }) {
  const id = useId();
  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <select id={id} className="entrada" value={valor} onChange={(e) => onChange(e.target.value)}>
        {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}
      </select>
    </Campo>
  );
}

export function SeletorIcone({ rotulo, valor, onChange, opcoes }: { rotulo: string; valor: string; onChange: (valor: string) => void; opcoes: OpcaoIcone[] }) {
  const id = useId();
  const Atual = ICONES[valor] ?? ICONE_PADRAO;
  return (
    <Campo rotulo={rotulo} id={id}>
      <div className="seletor-icone">
        <span className="seletor-icone-previa" aria-hidden="true"><Atual /></span>
        <select id={id} className="entrada" value={valor} onChange={(e) => onChange(e.target.value)}>
          {!opcoes.some((o) => o.valor === valor) && <option value={valor}>{valor}</option>}
          {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}
        </select>
      </div>
    </Campo>
  );
}

// ---------- imagem e arquivo ----------

interface PropsImagem extends CampoBase {
  valor: string;
  onChange: (valor: string) => void;
  maxLado?: number;
  aceitar?: string;
}

export function SeletorImagem({ rotulo, dica, valor, onChange, maxLado = 1600 }: PropsImagem) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const enviada = ehDataUrl(valor);

  const aoEscolher = async (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    setErro("");
    setOcupado(true);
    try {
      onChange(await comprimirImagem(arquivo, { maxLado }));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível usar essa imagem.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <div className="seletor-imagem">
        <div className="seletor-imagem-previa">
          {valor ? <img src={valor} alt="" /> : <span>Sem imagem</span>}
        </div>
        <div className="seletor-imagem-controles">
          {enviada ? (
            <p className="seletor-imagem-nota">Imagem enviada do seu computador ({tamanhoAproximadoKb(valor)} KB). Ela vai para o site quando você clicar em <strong>Salvar alterações</strong>.</p>
          ) : (
            <input id={id} className="entrada" type="text" value={valor} placeholder="/caminho/da/imagem.webp ou https://…" onChange={(e) => onChange(e.target.value)} />
          )}
          <div className="seletor-imagem-botoes">
            <button type="button" className="admin-botao admin-botao-contorno admin-botao-pequeno" onClick={() => entrada.current?.click()} disabled={ocupado}>
              <FaUpload aria-hidden="true" /> {ocupado ? "Processando…" : "Enviar imagem"}
            </button>
            {valor && (
              <ConfirmarExclusao rotulo="esta imagem" className="admin-botao admin-botao-texto admin-botao-pequeno" ariaLabel="Remover imagem" onConfirmar={() => onChange("")}><FaTrash aria-hidden="true" /> Remover</ConfirmarExclusao>
            )}
            <input ref={entrada} type="file" accept="image/*" hidden onChange={aoEscolher} data-testid="upload-imagem" />
          </div>
          {erro && <p className="campo-erro" role="alert">{erro}</p>}
        </div>
      </div>
    </Campo>
  );
}

export function SeletorArquivo({ rotulo, dica, valor, onChange, aceitar = "application/pdf", limiteMb = 3 }: PropsImagem & { limiteMb?: number }) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState("");
  const enviado = ehDataUrl(valor);

  const aoEscolher = (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    if (arquivo.size > limiteMb * 1024 * 1024) {
      setErro(`O arquivo tem mais de ${limiteMb} MB. Reduza o tamanho ou use um link.`);
      return;
    }
    setErro("");
    const leitor = new FileReader();
    leitor.onload = () => onChange(String(leitor.result));
    leitor.onerror = () => setErro("Não foi possível ler o arquivo.");
    leitor.readAsDataURL(arquivo);
  };

  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <div className="seletor-imagem-controles">
        {enviado ? (
          <p className="seletor-imagem-nota">Arquivo enviado do seu computador ({tamanhoAproximadoKb(valor)} KB). Vai para o site quando você clicar em <strong>Salvar alterações</strong>.</p>
        ) : (
          <input id={id} className="entrada" type="text" value={valor} placeholder="/curriculo.pdf ou https://…" onChange={(e) => onChange(e.target.value)} />
        )}
        <div className="seletor-imagem-botoes">
          <button type="button" className="admin-botao admin-botao-contorno admin-botao-pequeno" onClick={() => entrada.current?.click()}>
            <FaUpload aria-hidden="true" /> Enviar arquivo
          </button>
          {valor && (
            <ConfirmarExclusao rotulo="este arquivo" className="admin-botao admin-botao-texto admin-botao-pequeno" ariaLabel="Remover arquivo" onConfirmar={() => onChange("")}><FaTrash aria-hidden="true" /> Remover</ConfirmarExclusao>
          )}
          <input ref={entrada} type="file" accept={aceitar} hidden onChange={aoEscolher} />
        </div>
        {erro && <p className="campo-erro" role="alert">{erro}</p>}
      </div>
    </Campo>
  );
}

export function SeletorVideo({ rotulo, dica, valor, onChange, limiteMb = 3 }: PropsImagem & { limiteMb?: number }) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const enviado = ehDataUrl(valor);
  const aoEscolher = (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    if (!arquivo.type.startsWith("video/")) { setErro("Escolha um arquivo de vídeo."); return; }
    if (arquivo.size > limiteMb * 1024 * 1024) { setErro(`O vídeo tem mais de ${limiteMb} MB. Comprima o arquivo ou use um link.`); return; }
    setErro(""); setOcupado(true);
    const leitor = new FileReader();
    leitor.onload = () => { onChange(String(leitor.result)); setOcupado(false); };
    leitor.onerror = () => { setErro("Não foi possível ler o vídeo."); setOcupado(false); };
    leitor.readAsDataURL(arquivo);
  };
  return (
    <Campo rotulo={rotulo} dica={dica} id={id}>
      <div className="seletor-imagem-controles">
        {enviado ? <><video className="seletor-video-previa" src={valor} controls preload="metadata" />
          <p className="seletor-imagem-nota">Vídeo enviado ({tamanhoAproximadoKb(valor)} KB). Será enviado ao site quando você clicar em <strong>Salvar alterações</strong>.</p></> :
          <input id={id} className="entrada" type="text" value={valor} placeholder="https://… ou caminho do vídeo" onChange={(e) => onChange(e.target.value)} />}
        <div className="seletor-imagem-botoes">
          <button type="button" className="admin-botao admin-botao-contorno admin-botao-pequeno" onClick={() => entrada.current?.click()} disabled={ocupado}><FaUpload aria-hidden="true" /> {ocupado ? "Lendo vídeo…" : "Enviar vídeo"}</button>
          {valor && <ConfirmarExclusao rotulo="este vídeo" className="admin-botao admin-botao-texto admin-botao-pequeno" ariaLabel="Remover vídeo" onConfirmar={() => onChange("")}><FaTrash aria-hidden="true" /> Remover</ConfirmarExclusao>}
          <input ref={entrada} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={aoEscolher} />
        </div>
        {erro && <p className="campo-erro" role="alert">{erro}</p>}
      </div>
    </Campo>
  );
}

// ---------- listas ----------

interface PropsLista<T> {
  itens: T[];
  onChange: (itens: T[]) => void;
}

export function BotoesItem({ indice, total, onMover, onRemover, rotuloItem }: { indice: number; total: number; onMover: (passo: number) => void; onRemover: () => void; rotuloItem: string }) {
  return (
    <div className="botoes-item">
      <button type="button" className="icone-botao" onClick={() => onMover(-1)} disabled={indice === 0} aria-label={`Mover ${rotuloItem} para cima`}><FaArrowUp aria-hidden="true" /></button>
      <button type="button" className="icone-botao" onClick={() => onMover(1)} disabled={indice === total - 1} aria-label={`Mover ${rotuloItem} para baixo`}><FaArrowDown aria-hidden="true" /></button>
      <ConfirmarExclusao rotulo={rotuloItem} className="icone-botao icone-botao-perigo" ariaLabel={`Remover ${rotuloItem}`} onConfirmar={onRemover}><FaTrash aria-hidden="true" /></ConfirmarExclusao>
    </div>
  );
}

export function ConfirmarExclusao({ rotulo, className, ariaLabel, onConfirmar, children }: { rotulo: string; className: string; ariaLabel: string; onConfirmar: () => void; children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const tituloId = useId();
  return (
    <>
      <button type="button" className={className} aria-label={ariaLabel} onClick={() => setAberto(true)}>{children}</button>
      {aberto && <div className="admin-confirmacao-fundo" role="presentation" onKeyDown={(evento) => { if (evento.key === "Escape") setAberto(false); }} onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setAberto(false); }}>
        <section className="admin-confirmacao" role="alertdialog" aria-modal="true" aria-labelledby={tituloId}>
          <span className="admin-confirmacao-icone" aria-hidden="true"><FaTrash /></span>
          <p className="admin-confirmacao-selo">Confirmar exclusão</p>
          <h2 id={tituloId}>Remover {rotulo}?</h2>
          <p>Este item será removido do rascunho. Você pode descartar as alterações para recuperá-lo antes de salvar.</p>
          <div className="admin-confirmacao-acoes">
            <button type="button" className="admin-botao admin-botao-contorno" autoFocus onClick={() => setAberto(false)}>Cancelar</button>
            <button type="button" className="admin-botao admin-botao-perigo" onClick={() => { onConfirmar(); setAberto(false); }}>Excluir item</button>
          </div>
        </section>
      </div>}
    </>
  );
}

/** Lista de textos (cargos, tecnologias, desafios...), cada linha com mover e remover. */
export function ListaTextos({ rotulo, dica, itens, onChange, placeholder, multilinha, adicionar = "Adicionar" }: PropsLista<string> & CampoBase & { placeholder?: string; multilinha?: boolean; adicionar?: string }) {
  const alterar = (fn: (copia: string[]) => void) => {
    const copia = [...itens];
    fn(copia);
    onChange(copia);
  };
  return (
    <fieldset className="lista">
      <legend className="campo-rotulo">{rotulo}</legend>
      {itens.map((item, i) => (
        <div key={i} className="lista-linha">
          {multilinha ? (
            <textarea className="entrada" rows={3} value={item} placeholder={placeholder} aria-label={`${rotulo} ${i + 1}`} onChange={(e) => alterar((c) => { c[i] = e.target.value; })} />
          ) : (
            <input className="entrada" type="text" value={item} placeholder={placeholder} aria-label={`${rotulo} ${i + 1}`} onChange={(e) => alterar((c) => { c[i] = e.target.value; })} />
          )}
          <BotoesItem indice={i} total={itens.length} rotuloItem={`${rotulo} ${i + 1}`} onMover={(p) => alterar((c) => moverItem(c, i, p))} onRemover={() => alterar((c) => removerItem(c, i))} />
        </div>
      ))}
      <button type="button" className="admin-botao admin-botao-contorno admin-botao-pequeno" onClick={() => alterar((c) => { c.push(""); })}>
        <FaPlus aria-hidden="true" /> {adicionar}
      </button>
      {dica && <small className="campo-dica">{dica}</small>}
    </fieldset>
  );
}

/** Bloco recolhível (usa <details>, funciona sem JavaScript extra). */
export function Bloco({ titulo, resumo, children, aberto = false }: { titulo: string; resumo?: string; children: ReactNode; aberto?: boolean }) {
  return (
    <details className="bloco" open={aberto}>
      <summary>
        <span>{titulo}</span>
        {resumo && <small>{resumo}</small>}
      </summary>
      <div className="bloco-corpo">{children}</div>
    </details>
  );
}

export function TituloAba({ titulo, descricao }: { titulo: string; descricao?: string }) {
  return (
    <header className="aba-titulo">
      <h2>{titulo}</h2>
      {descricao && <p>{descricao}</p>}
    </header>
  );
}
