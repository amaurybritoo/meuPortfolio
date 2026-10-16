import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaCloudUploadAlt, FaCog, FaEnvelope, FaExternalLinkAlt, FaFileAlt, FaGraduationCap, FaLock, FaPalette, FaProjectDiagram, FaSearch, FaSignOutAlt, FaTools, FaUser } from "react-icons/fa";
import type { IconType } from "react-icons";
import AparenciaAba from "./admin/abas/AparenciaAba";
import ContatoAba from "./admin/abas/ContatoAba";
import ExperienciaAba from "./admin/abas/ExperienciaAba";
import FormacaoAba from "./admin/abas/FormacaoAba";
import HabilidadesAba from "./admin/abas/HabilidadesAba";
import PerfilAba from "./admin/abas/PerfilAba";
import ProjetosAba from "./admin/abas/ProjetosAba";
import PublicarAba from "./admin/abas/PublicarAba";
import SecoesAba from "./admin/abas/SecoesAba";
import SeoAba from "./admin/abas/SeoAba";
import SobreAba from "./admin/abas/SobreAba";
import type { PropsAba } from "./admin/tiposAdmin";
import { useRascunho } from "./admin/useRascunho";
import { validarPortfolio } from "./admin/validar";
import "../estilos/admin.css";

interface DefinicaoAba {
  id: string;
  rotulo: string;
  icone: IconType;
  componente?: ComponentType<PropsAba>;
}

const ABAS: DefinicaoAba[] = [
  { id: "perfil", rotulo: "Perfil", icone: FaUser, componente: PerfilAba },
  { id: "sobre", rotulo: "Sobre", icone: FaFileAlt, componente: SobreAba },
  { id: "habilidades", rotulo: "Habilidades", icone: FaTools, componente: HabilidadesAba },
  { id: "projetos", rotulo: "Projetos", icone: FaProjectDiagram, componente: ProjetosAba },
  { id: "formacao", rotulo: "Formação", icone: FaGraduationCap, componente: FormacaoAba },
  { id: "experiencia", rotulo: "Experiências", icone: FaBriefcase, componente: ExperienciaAba },
  { id: "contato", rotulo: "Contato", icone: FaEnvelope, componente: ContatoAba },
  { id: "secoes", rotulo: "Seções", icone: FaCog, componente: SecoesAba },
  { id: "aparencia", rotulo: "Aparência", icone: FaPalette, componente: AparenciaAba },
  { id: "seo", rotulo: "Google", icone: FaSearch, componente: SeoAba },
  { id: "publicar", rotulo: "Publicar", icone: FaCloudUploadAlt },
];

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    document.title = "Acesso ao painel | Portfólio";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    void fetch("/api/admin/auth", { credentials: "same-origin", cache: "no-store" })
      .then(async (resposta) => {
        if (!resposta.headers.get("content-type")?.includes("application/json")) {
          setMensagem("O servidor de autenticação do painel não respondeu. Em desenvolvimento local, inicie com `vercel dev`; no site publicado, confira as variáveis privadas no Vercel e publique novamente.");
          return;
        }
        const dados = await resposta.json().catch(() => ({}));
        if (resposta.ok && dados.authenticated === true) setAutenticado(true);
        else if (dados.configured === false) setMensagem("O acesso ainda não foi configurado na hospedagem. Defina ADMIN_ACCESS_CODE e ADMIN_SESSION_SECRET nas variáveis de ambiente do servidor.");
      })
      .catch(() => setMensagem("Não foi possível verificar o acesso ao painel. Confira a conexão com o servidor."))
      .finally(() => setVerificando(false));
    return () => meta.remove();
  }, []);

  const entrar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setOcupado(true);
    setMensagem("");
    try {
      const resposta = await fetch("/api/admin/auth", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codigo.trim() }),
      });
      if (!resposta.headers.get("content-type")?.includes("application/json")) {
        setMensagem("O servidor de autenticação do painel não respondeu. Inicie a API com `vercel dev` ou confira a configuração da hospedagem.");
        return;
      }
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok || dados.authenticated !== true) {
        setMensagem(dados.error || "Não foi possível validar o código. Confira a configuração do servidor.");
        return;
      }
      setCodigo("");
      setAutenticado(true);
    } catch {
      setMensagem("Não foi possível conectar ao servidor para validar o código.");
    } finally {
      setOcupado(false);
    }
  };

  const sair = async () => {
    await fetch("/api/admin/auth", { method: "DELETE", credentials: "same-origin" }).catch(() => undefined);
    setAutenticado(false);
    setMensagem("Sessão encerrada.");
  };

  if (verificando) return <main className="admin-login"><p role="status">Verificando acesso…</p></main>;
  if (!autenticado) {
    return (
      <main className="admin-login">
        <form className="admin-login-cartao" onSubmit={entrar}>
          <span className="admin-login-selo" aria-hidden="true"><FaLock /></span>
          <p className="admin-login-rotulo">Área restrita</p>
          <h1>Painel administrativo</h1>
          <p>Insira o código de acesso para continuar.</p>
          <label htmlFor="codigo-admin">Código de acesso</label>
          <input id="codigo-admin" type="password" autoComplete="off" value={codigo} onChange={(evento) => setCodigo(evento.target.value)} required autoFocus />
          {mensagem && <p className="admin-login-mensagem" role="alert">{mensagem}</p>}
          <button className="admin-botao admin-botao-primario" type="submit" disabled={ocupado || !codigo}>{ocupado ? "Verificando…" : "Entrar no painel"}</button>
        </form>
      </main>
    );
  }
  return <PainelAdmin aoSair={sair} />;
}

function PainelAdmin({ aoSair }: { aoSair: () => void }) {
  const rascunho = useRascunho();
  const { dados, atualizar, alterado, salvoNoNavegador } = rascunho;
  const [abaAtual, setAbaAtual] = useState("perfil");
  const [projetoSelecionado, setProjetoSelecionado] = useState(() => dados.projetos[0]?.id ?? "");
  const problemas = useMemo(() => validarPortfolio(dados), [dados]);
  const totalErros = problemas.filter((p) => p.nivel === "erro").length;

  const aba = ABAS.find((a) => a.id === abaAtual) ?? ABAS[0];
  const Conteudo = aba.componente;

  const irParaAba = (id: string, alvo?: string) => {
    if (alvo) setProjetoSelecionado(alvo);
    setAbaAtual(id);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="admin">
      <header className="admin-topo">
        <div className="admin-topo-marca">
          {dados.perfil.logo && <img className="logo-pulsante" src={dados.perfil.logo} alt="" width={46} height={46} />}
          <div>
            <strong>Painel do portfólio</strong>
            <small>{dados.perfil.nome}</small>
          </div>
        </div>
        <div className="admin-topo-estado" role="status" aria-live="polite">
          <span className={`admin-ponto ${alterado ? "pendente" : "ok"}`} aria-hidden="true" />
          {alterado ? (salvoNoNavegador ? "Rascunho salvo · não publicado" : "Rascunho não salvo (sem espaço)") : "Tudo publicado"}
        </div>
        <div className="admin-topo-acoes">
          <Link to="/" className="admin-botao admin-botao-texto admin-botao-pequeno">Ver site <FaExternalLinkAlt aria-hidden="true" /></Link>
          <button type="button" className="admin-botao admin-botao-contorno admin-botao-pequeno" onClick={aoSair}><FaSignOutAlt aria-hidden="true" /> Sair</button>
          <button type="button" className="admin-botao admin-botao-primario admin-botao-pequeno" onClick={() => irParaAba("publicar")}>
            Publicar{alterado ? " alterações" : ""}
            {totalErros > 0 && <span className="admin-contador" aria-label={`${totalErros} pendência(s)`}>{totalErros}</span>}
          </button>
        </div>
      </header>

      <div className="admin-corpo">
        <nav className="admin-menu" aria-label="Seções do admin">
          <ul>
            {ABAS.map((item) => {
              const Icone = item.icone;
              return (
                <li key={item.id}>
                  <button type="button" className={item.id === aba.id ? "ativo" : ""} aria-current={item.id === aba.id ? "page" : undefined} onClick={() => irParaAba(item.id)}>
                    <Icone aria-hidden="true" />
                    <span>{item.rotulo}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="admin-painel" id={`aba-${aba.id}`}>
          {Conteudo ? (
            <Conteudo dados={dados} atualizar={atualizar} projetoSelecionado={projetoSelecionado} aoSelecionarProjeto={setProjetoSelecionado} />
          ) : (
            <PublicarAba
              dados={dados}
              alterado={alterado}
              salvoNoNavegador={salvoNoNavegador}
              problemas={problemas}
              irParaAba={irParaAba}
              aoImportar={rascunho.substituir}
              aoDescartar={rascunho.descartar}
              aoPublicar={rascunho.marcarPublicado}
              aoSincronizar={rascunho.sincronizarComSite}
            />
          )}
        </main>
      </div>
    </div>
  );
}
