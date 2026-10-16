import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaEye, FaSave, FaUndo, FaUpload } from "react-icons/fa";
import { normalizarPortfolio } from "../../../data/padrao";
import type { Portfolio } from "../../../tipos";
import { coletarImagens } from "../../../utilitarios/referenciasMidia";
import { Bloco } from "../campos";
import { TituloAba } from "../campos";
import type { Problema } from "../validar";

interface Props {
  dados: Portfolio;
  carregado: boolean;
  alterado: boolean;
  salvoNoNavegador: boolean;
  problemas: Problema[];
  irParaAba: (aba: string, alvo?: string) => void;
  aoImportar: (novos: Portfolio) => void;
  aoDescartar: () => void;
  aoPublicar: (publicado: Portfolio) => void;
  aoSincronizar: () => void;
}

export default function PublicarAba({ dados, carregado, alterado, salvoNoNavegador, problemas, irParaAba, aoImportar, aoDescartar, aoPublicar, aoSincronizar }: Props) {
  const [registro, setRegistro] = useState<string[]>([]);
  const [ocupado, setOcupado] = useState(false);
  const [resultado, setResultado] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const arquivoImport = useRef<HTMLInputElement>(null);
  const erros = problemas.filter((p) => p.nivel === "erro");
  const arquivosPendentes = coletarImagens(dados).length;

  const salvar = async () => {
    if (erros.length > 0) return;
    setOcupado(true);
    setResultado(null);
    setRegistro([]);
    try {
      const copia = structuredClone(dados);
      const refs = coletarImagens(copia);
      const total = new Set(refs.map((ref) => ref.ler())).size;
      const enviadas = new Map<string, string>();
      let indice = 0;
      for (const ref of refs) {
        const original = ref.ler();
        const existente = enviadas.get(original);
        if (existente) {
          ref.escrever(existente);
          continue;
        }
        indice++;
        setRegistro((linhas) => [...linhas, `Enviando arquivo ${indice} de ${total}…`]);
        const resposta = await fetch("/api/admin/media", {
          method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataUrl: original }),
        });
        const corpo = await resposta.json().catch(() => ({}));
        if (!resposta.ok || typeof corpo.url !== "string") throw new Error(corpo.error || "Não foi possível enviar um arquivo ao Supabase.");
        enviadas.set(original, corpo.url);
        ref.escrever(corpo.url);
      }
      setRegistro((linhas) => [...linhas, "Salvando conteúdo no banco…"]);
      const resposta = await fetch("/api/admin/portfolio", {
        method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: copia }),
      });
      const corpo = await resposta.json().catch(() => ({}));
      if (!resposta.ok || corpo.saved !== true) throw new Error(corpo.error || "Não foi possível salvar no Supabase.");
      aoPublicar(copia);
      setResultado({ tipo: "ok", texto: "Salvo no Supabase. O site já está atualizado, sem precisar publicar de novo." });
    } catch (erro) {
      setResultado({ tipo: "erro", texto: erro instanceof Error ? erro.message : "Não foi possível salvar." });
    } finally {
      setOcupado(false);
    }
  };

  const baixar = () => {
    const blob = new Blob([`${JSON.stringify(dados, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importar = async (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    try {
      const bruto: unknown = JSON.parse(await arquivo.text());
      if (!bruto || typeof bruto !== "object" || !("perfil" in bruto)) throw new Error("formato");
      if (window.confirm("Importar este arquivo? O conteúdo atual do rascunho será substituído.")) aoImportar(normalizarPortfolio(bruto));
    } catch {
      setResultado({ tipo: "erro", texto: "Esse arquivo não parece ser um portfolio.json válido." });
    }
  };

  return (
    <>
      <TituloAba titulo="Salvar alterações" descricao="As edições ficam como rascunho neste navegador até você salvar no Supabase." />

      <div className={`painel-cartao status-card ${alterado ? "status-pendente" : "status-ok"}`} role="status">
        {alterado ? <FaExclamationTriangle aria-hidden="true" /> : <FaCheckCircle aria-hidden="true" />}
        <div>
          <strong>{alterado ? "Há alterações não salvas no site" : "Tudo salvo no Supabase"}</strong>
          <p>{alterado ? salvoNoNavegador ? "O rascunho está guardado neste navegador. Salve para atualizar o site." : "O navegador não conseguiu guardar o rascunho. Salve agora para não perder as alterações." : "O site está mostrando o último conteúdo salvo."}</p>
        </div>
        <a className="admin-botao admin-botao-contorno admin-botao-pequeno" href="/?preview=1" target="_blank" rel="noopener noreferrer"><FaEye aria-hidden="true" /> Pré-visualizar</a>
      </div>

      {problemas.length > 0 && <div className="painel-cartao">
        <h3>Verificação antes de salvar</h3>
        <ul className="problemas">{problemas.map((p, i) => <li key={i} className={`problema problema-${p.nivel}`}><span>{p.nivel === "erro" ? "Corrigir" : "Aviso"}</span><p>{p.mensagem}</p><button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" onClick={() => irParaAba(p.aba, p.alvo)}>Ir para a aba</button></li>)}</ul>
      </div>}

      <div className="painel-cartao">
        <h3><FaSave aria-hidden="true" /> Salvar no Supabase</h3>
        <p className="campo-dica">O conteúdo vai direto para o banco e as imagens para o armazenamento do Supabase. As alterações aparecem no site sem novo deploy.</p>
        {arquivosPendentes > 0 && <p className="nota-info">{arquivosPendentes} imagem(ns), vídeo(s) ou arquivo(s) novo(s) serão enviados ao Supabase junto com o conteúdo.</p>}
        <div className="acoes-linha">
          <button type="button" className="admin-botao admin-botao-primario" onClick={salvar} disabled={!carregado || ocupado || erros.length > 0}><FaSave aria-hidden="true" /> {!carregado ? "Carregando…" : ocupado ? "Salvando…" : "Salvar alterações"}</button>
        </div>
        {erros.length > 0 && <p className="campo-erro">Corrija os itens marcados como “Corrigir” para liberar o salvamento.</p>}
        {resultado && <p className={resultado.tipo === "ok" ? "resultado resultado-ok" : "resultado resultado-erro"} role="alert">{resultado.texto}</p>}
        {registro.length > 0 && <ol className="registro" aria-label="Andamento">{registro.map((linha, i) => <li key={i}>{linha}</li>)}</ol>}
        <Bloco titulo="Sobre o armazenamento">
          <p>O conteúdo fica na tabela <code>portfolio_content</code> e os arquivos no bucket <code>portfolio-media</code>. As chaves privadas do Supabase ficam somente no servidor.</p>
        </Bloco>
      </div>

      <div className="painel-cartao">
        <h3>Backup e restauração</h3>
        <p className="campo-dica">Você pode guardar uma cópia do conteúdo em JSON ou importar um backup neste navegador.</p>
        <div className="acoes-linha">
          <button type="button" className="admin-botao admin-botao-contorno" onClick={baixar}><FaDownload aria-hidden="true" /> Baixar backup JSON</button>
          <button type="button" className="admin-botao admin-botao-contorno" onClick={() => arquivoImport.current?.click()}><FaUpload aria-hidden="true" /> Importar backup JSON</button>
          <input ref={arquivoImport} type="file" accept="application/json,.json" hidden onChange={importar} />
        </div>
      </div>

      <div className="painel-cartao">
        <h3>Voltar atrás</h3>
        <div className="acoes-linha">
          <button type="button" className="admin-botao admin-botao-contorno" disabled={!alterado} onClick={() => { if (window.confirm("Descartar o rascunho e voltar à última versão salva?")) aoDescartar(); }}><FaUndo aria-hidden="true" /> Descartar alterações</button>
          <button type="button" className="admin-botao admin-botao-texto" onClick={() => { if (window.confirm("Recarregar a versão salva no Supabase? As alterações locais serão descartadas.")) aoSincronizar(); }}>Recarregar versão salva</button>
        </div>
      </div>
    </>
  );
}
