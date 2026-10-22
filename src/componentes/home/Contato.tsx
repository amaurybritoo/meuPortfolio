import { useState } from "react";
import type { FormEvent } from "react";
import { FaCheck, FaCopy, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { usePortfolio } from "../../contexto/usePortfolio";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Icone from "../comuns/Icone";
import Revelar from "../comuns/Revelar";
import { Markdown } from "../comuns/Markdown";
import { formatarWhatsAppBrasil } from "../../utilitarios/texto";
import "../../estilos/contato.css";

export default function Contato() {
  const { dados } = usePortfolio();
  const { perfil, contato, secoes } = dados;
  const config = secoes.contato;
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [copiado, setCopiado] = useState(false);
  if (!config.ativa) return null;

  const montarTexto = () => `${nome.trim() ? `Me chamo ${nome.trim()},` : "Olá!"}\n${mensagem.trim() || contato.mensagemWhatsapp}`;
  const linkWhatsapp = perfil.whatsapp ? `https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(montarTexto())}` : "";
  const linkEmail = perfil.email
    ? `mailto:${perfil.email}?subject=${encodeURIComponent(`Contato pelo portfólio${nome.trim() ? ` — ${nome.trim()}` : ""}`)}&body=${encodeURIComponent(montarTexto().replace(/\n/g, "\r\n"))}`
    : "";

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(perfil.email);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      window.location.href = `mailto:${perfil.email}`;
    }
  };

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    if (linkWhatsapp) window.open(linkWhatsapp, "_blank", "noopener,noreferrer");
    else if (linkEmail) window.location.href = linkEmail;
  };

  const outrasRedes = perfil.redes.filter((r) => r.url && r.icone !== "email" && r.icone !== "whatsapp");

  return (
    <section id="contato" className="secao secao-contato" aria-labelledby="titulo-contato">
      <div className="container">
        <Revelar>
          <CabecalhoSecao id="titulo-contato" titulo={config.titulo} subtitulo={config.subtitulo} />
        </Revelar>

        <Revelar className="contato-chamada">
            <h3>{contato.titulo}</h3>
            {contato.texto && <Markdown className="contato-texto" texto={contato.texto} />}
        </Revelar>

        <div className="contato-grade">
          <Revelar className="contato-lado">
            <ul className="contato-canais">
              {perfil.email && (
                <li>
                  <a className="canal" href={`mailto:${perfil.email}`}>
                    <span className="canal-icone"><FaEnvelope aria-hidden="true" /></span>
                    <span><small>E-mail</small>{perfil.email}</span>
                  </a>
                  <button type="button" className="canal-copiar" onClick={copiarEmail} aria-label="Copiar e-mail">
                    {copiado ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
                    <span aria-live="polite">{copiado ? "Copiado" : "Copiar"}</span>
                  </button>
                </li>
              )}
              {perfil.whatsapp && (
                <li>
                  <a className="canal" href={`https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsapp)}`} target="_blank" rel="noopener noreferrer">
                    <span className="canal-icone"><FaWhatsapp aria-hidden="true" /></span>
                    <span><small>WhatsApp</small><strong>{formatarWhatsAppBrasil(perfil.whatsapp)}</strong></span>
                  </a>
                </li>
              )}
              {outrasRedes.map((rede) => (
                <li key={rede.id}>
                  <a className="canal" href={rede.url} target="_blank" rel="noopener noreferrer">
                    <span className="canal-icone"><Icone nome={rede.icone} /></span>
                    <span><small>{rede.rotulo}</small>Ver perfil</span>
                  </a>
                </li>
              ))}
            </ul>
          </Revelar>

          {contato.mostrarFormulario && (perfil.whatsapp || perfil.email) && (
            <Revelar atraso={120}>
              <form className="contato-form" onSubmit={enviar}>
                <h3>Mande uma mensagem</h3>
                <label>
                  Seu nome
                  <input type="text" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como posso te chamar?" autoComplete="name" />
                </label>
                <label>
                  Mensagem
                  <textarea name="mensagem" rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder={contato.mensagemWhatsapp} />
                </label>
                <div className="contato-form-acoes">
                  {linkWhatsapp && (
                    <button type="submit" className="botao botao-primario">
                      <FaWhatsapp aria-hidden="true" /> Enviar pelo WhatsApp
                    </button>
                  )}
                  {linkEmail && (
                    <a className="botao botao-contorno" href={linkEmail}>
                      <FaEnvelope aria-hidden="true" /> Enviar por e-mail
                    </a>
                  )}
                </div>
                <p className="contato-nota">A mensagem abre no WhatsApp ou no seu aplicativo de e-mail para você revisar antes de enviar.</p>
              </form>
            </Revelar>
          )}
        </div>
      </div>
    </section>
  );
}
