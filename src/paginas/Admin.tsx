import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { FaCloudUploadAlt, FaCog, FaEnvelope, FaExternalLinkAlt, FaFileAlt, FaGraduationCap, FaPalette, FaProjectDiagram, FaSearch, FaTools, FaUser } from "react-icons/fa";
import type { IconType } from "react-icons";
import AparenciaAba from "./admin/abas/AparenciaAba";
import ContatoAba from "./admin/abas/ContatoAba";
import ExperienciaAba from "./admin/abas/ExperienciaAba";
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
  { id: "experiencia", rotulo: "Formação", icone: FaGraduationCap, componente: ExperienciaAba },
  { id: "contato", rotulo: "Contato", icone: FaEnvelope, componente: ContatoAba },
  { id: "secoes", rotulo: "Seções", icone: FaCog, componente: SecoesAba },
  { id: "aparencia", rotulo: "Aparência", icone: FaPalette, componente: AparenciaAba },
  { id: "seo", rotulo: "Google", icone: FaSearch, componente: SeoAba },
  { id: "publicar", rotulo: "Publicar", icone: FaCloudUploadAlt },
];

export default function Admin() {
  const rascunho = useRascunho();
  const { dados, atualizar, alterado, salvoNoNavegador } = rascunho;
  const [abaAtual, setAbaAtual] = useState("perfil");
  const [projetoSelecionado, setProjetoSelecionado] = useState(() => dados.projetos[0]?.id ?? "");
  const problemas = useMemo(() => validarPortfolio(dados), [dados]);
  const totalErros = problemas.filter((p) => p.nivel === "erro").length;

  // o admin não deve aparecer em buscadores
  useEffect(() => {
    document.title = "Admin | Portfólio";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

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
          {dados.perfil.logo && <img src={dados.perfil.logo} alt="" width={36} height={36} />}
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
