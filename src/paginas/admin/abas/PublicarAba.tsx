import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaEye, FaRocket, FaUndo, FaUpload } from "react-icons/fa";
import { normalizarPortfolio } from "../../../data/padrao";
import type { Portfolio } from "../../../tipos";
import { esquecerToken, lerGithub, salvarGithub } from "../../../utilitarios/armazenamento";
import type { ConfigGithub } from "../../../utilitarios/armazenamento";
import { contarImagensPendentes, ErroPublicacao, publicarNoGithub, testarConexao } from "../../../utilitarios/github";
import { Bloco, CampoTexto, Interruptor, TituloAba } from "../campos";
import type { Problema } from "../validar";

interface Props {
  dados: Portfolio;
  alterado: boolean;
  salvoNoNavegador: boolean;
  problemas: Problema[];
  irParaAba: (aba: string, alvo?: string) => void;
  aoImportar: (novos: Portfolio) => void;
  aoDescartar: () => void;
  aoPublicar: (publicado: Portfolio) => void;
  aoSincronizar: () => void;
}

export default function PublicarAba({ dados, alterado, salvoNoNavegador, problemas, irParaAba, aoImportar, aoDescartar, aoPublicar, aoSincronizar }: Props) {
  const [cfg, setCfg] = useState<ConfigGithub>(() => lerGithub());
  const [mostrarToken, setMostrarToken] = useState(false);
  const [registro, setRegistro] = useState<string[]>([]);
  const [ocupado, setOcupado] = useState(false);
  const [resultado, setResultado] = useState<{ tipo: "ok" | "erro"; texto: string; url?: string } | null>(null);
  const arquivoImport = useRef<HTMLInputElement>(null);

  const erros = problemas.filter((p) => p.nivel === "erro");
  const avisos = problemas.filter((p) => p.nivel === "aviso");
  const imagensPendentes = contarImagensPendentes(dados);

  const atualizarCfg = (parcial: Partial<ConfigGithub>) => {
    const novo = { ...cfg, ...parcial };
    setCfg(novo);
    salvarGithub(novo);
  };

  const anotar = (texto: string) => setRegistro((r) => [...r, texto]);

  const testar = async () => {
    setOcupado(true);
    setResultado(null);
    setRegistro([]);
    try {
      anotar(await testarConexao(cfg));
      setResultado({ tipo: "ok", texto: "Conexão funcionando. Pode publicar." });
    } catch (e) {
      setResultado({ tipo: "erro", texto: e instanceof ErroPublicacao || e instanceof Error ? e.message : "Falha ao testar a conexão." });
    } finally {
      setOcupado(false);
    }
  };

  const publicar = async () => {
    if (erros.length > 0) return;
    if (!window.confirm("Publicar agora? O site será atualizado em 1 a 2 minutos.")) return;
    setOcupado(true);
    setResultado(null);
    setRegistro([]);
    try {
      const r = await publicarNoGithub(dados, cfg, anotar);
      aoPublicar(r.dados);
      setResultado({ tipo: "ok", texto: `Publicado! ${r.imagensEnviadas > 0 ? `${r.imagensEnviadas} arquivo(s) enviado(s). ` : ""}A Vercel vai atualizar o site em instantes.`, url: r.url });
    } catch (e) {
      setResultado({ tipo: "erro", texto: e instanceof Error ? e.message : "Não foi possível publicar." });
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
      <TituloAba titulo="Publicar" descricao="Suas alterações ficam salvas como rascunho neste navegador. Aqui você coloca tudo no ar." />

      <div className={`painel-cartao status-card ${alterado ? "status-pendente" : "status-ok"}`} role="status">
        {alterado ? <FaExclamationTriangle aria-hidden="true" /> : <FaCheckCircle aria-hidden="true" />}
        <div>
          <strong>{alterado ? "Há alterações ainda não publicadas" : "Tudo publicado"}</strong>
          <p>
            {alterado
              ? salvoNoNavegador ? "Seu rascunho está salvo automaticamente neste navegador." : "Atenção: o navegador não conseguiu guardar o rascunho (pouco espaço). Publique ou baixe o arquivo para não perder."
              : "O que você vê aqui é igual ao que está no site."}
          </p>
        </div>
        <a className="admin-botao admin-botao-contorno admin-botao-pequeno" href="/?preview=1" target="_blank" rel="noopener noreferrer"><FaEye aria-hidden="true" /> Pré-visualizar o site</a>
      </div>

      {problemas.length > 0 && (
        <div className="painel-cartao">
          <h3>Verificação antes de publicar</h3>
          <ul className="problemas">
            {[...erros, ...avisos].map((p, i) => (
              <li key={i} className={`problema problema-${p.nivel}`}>
                <span>{p.nivel === "erro" ? "Corrigir" : "Aviso"}</span>
                <p>{p.mensagem}</p>
                <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" onClick={() => irParaAba(p.aba, p.alvo)}>Ir para a aba</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="painel-cartao">
        <h3><FaRocket aria-hidden="true" /> Publicar pelo GitHub</h3>
        <p className="campo-dica">O admin grava o conteúdo (e as imagens que você enviou) no seu repositório. A Vercel percebe o commit e atualiza o site sozinha. Nenhum servidor é necessário.</p>
        {imagensPendentes > 0 && <p className="nota-info">{imagensPendentes} imagem(ns)/arquivo(s) enviado(s) do computador serão publicados junto.</p>}

        <div className="grade-campos">
          <CampoTexto rotulo="Usuário do GitHub" valor={cfg.owner} onChange={(v) => atualizarCfg({ owner: v })} />
          <CampoTexto rotulo="Repositório" valor={cfg.repo} onChange={(v) => atualizarCfg({ repo: v })} />
          <CampoTexto rotulo="Branch" valor={cfg.branch} onChange={(v) => atualizarCfg({ branch: v })} />
          <CampoTexto rotulo="Arquivo do conteúdo" valor={cfg.caminhoJson} onChange={(v) => atualizarCfg({ caminhoJson: v })} />
          <CampoTexto rotulo="Pasta das imagens" valor={cfg.pastaUploads} onChange={(v) => atualizarCfg({ pastaUploads: v })} />
          <div className="campo">
            <label className="campo-rotulo" htmlFor="campo-token">Token de acesso</label>
            <div className="campo-com-botao">
              <input id="campo-token" className="entrada" type={mostrarToken ? "text" : "password"} value={cfg.token} autoComplete="off" placeholder="github_pat_…" onChange={(e) => atualizarCfg({ token: e.target.value })} />
              <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" onClick={() => setMostrarToken((v) => !v)}>{mostrarToken ? "Ocultar" : "Mostrar"}</button>
            </div>
          </div>
        </div>
        <Interruptor rotulo="Lembrar o token neste navegador" dica="Desligado = o token vale só enquanto esta aba estiver aberta (mais seguro). Use só no seu computador." valor={cfg.lembrarToken} onChange={(v) => atualizarCfg({ lembrarToken: v })} />

        <div className="acoes-linha">
          <button type="button" className="admin-botao admin-botao-contorno" onClick={testar} disabled={ocupado}>Testar conexão</button>
          <button type="button" className="admin-botao admin-botao-primario" onClick={publicar} disabled={ocupado || erros.length > 0}>
            <FaRocket aria-hidden="true" /> {ocupado ? "Publicando…" : "Publicar agora"}
          </button>
          <button type="button" className="admin-botao admin-botao-texto admin-botao-pequeno" onClick={() => { esquecerToken(); setCfg((c) => ({ ...c, token: "" })); }}>Esquecer token</button>
        </div>
        {erros.length > 0 && <p className="campo-erro">Corrija os itens marcados como “Corrigir” para liberar a publicação.</p>}

        {resultado && (
          <p className={resultado.tipo === "ok" ? "resultado resultado-ok" : "resultado resultado-erro"} role="alert">
            {resultado.texto}{" "}
            {resultado.url && <a href={resultado.url} target="_blank" rel="noopener noreferrer">Ver commit</a>}
          </p>
        )}
        {registro.length > 0 && (
          <ol className="registro" aria-label="Andamento">
            {registro.map((linha, i) => <li key={i}>{linha}</li>)}
          </ol>
        )}

        <Bloco titulo="Como criar o token (uma vez só)">
          <ol className="passos">
            <li>No GitHub, abra <strong>Settings → Developer settings → Personal access tokens → Fine-grained tokens</strong> e clique em <strong>Generate new token</strong>.</li>
            <li>Em <strong>Repository access</strong>, escolha <strong>Only select repositories</strong> e marque o repositório do portfólio.</li>
            <li>Em <strong>Permissions → Repository permissions</strong>, deixe <strong>Contents</strong> como <strong>Read and write</strong>.</li>
            <li>Gere o token, copie e cole no campo acima. Ele só funciona neste repositório.</li>
          </ol>
        </Bloco>
      </div>

      <div className="painel-cartao">
        <h3>Sem GitHub? Publique manualmente</h3>
        <p className="campo-dica">Baixe o arquivo e substitua <code>src/data/portfolio.json</code> no projeto; depois faça o commit/push normalmente. {imagensPendentes > 0 && "As imagens enviadas do computador vão dentro do arquivo (fica grande); a publicação pelo GitHub é mais leve."}</p>
        <div className="acoes-linha">
          <button type="button" className="admin-botao admin-botao-contorno" onClick={baixar}><FaDownload aria-hidden="true" /> Baixar portfolio.json</button>
          <button type="button" className="admin-botao admin-botao-contorno" onClick={() => arquivoImport.current?.click()}><FaUpload aria-hidden="true" /> Importar portfolio.json</button>
          <input ref={arquivoImport} type="file" accept="application/json,.json" hidden onChange={importar} data-testid="importar-json" />
        </div>
      </div>

      <div className="painel-cartao">
        <h3>Voltar atrás</h3>
        <div className="acoes-linha">
          <button type="button" className="admin-botao admin-botao-contorno" disabled={!alterado} onClick={() => { if (window.confirm("Descartar o rascunho e voltar para a última versão publicada?")) aoDescartar(); }}><FaUndo aria-hidden="true" /> Descartar alterações</button>
          <button type="button" className="admin-botao admin-botao-texto" onClick={() => { if (window.confirm("Recarregar o conteúdo que veio com o site e apagar o rascunho deste navegador?")) aoSincronizar(); }}>Recarregar do site</button>
        </div>
      </div>
    </>
  );
}
