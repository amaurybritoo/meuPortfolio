import { FaDownload, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { usePortfolio } from "../../contexto/usePortfolio";
import CabecalhoSecao from "../comuns/CabecalhoSecao";
import Revelar from "../comuns/Revelar";
import { formatarWhatsAppBrasil } from "../../utilitarios/texto";
import "../../estilos/secoes.css";

export default function Sobre() {
  const { dados } = usePortfolio();
  const { perfil, secoes, contato } = dados;
  const config = secoes.sobre;
  const textos = perfil.sobre.length > 0 ? perfil.sobre : perfil.resumo ? [perfil.resumo] : [];
  if (!config.ativa || textos.length === 0) return null;

  const temInfo = Boolean(perfil.localizacao || perfil.email || perfil.whatsapp || perfil.curriculo || perfil.disponivel);

  return (
    <section id="sobre" className="secao" aria-labelledby="titulo-sobre">
      <div className="container">
        <Revelar>
          <CabecalhoSecao id="titulo-sobre" rotulo="01" titulo={config.titulo} subtitulo={config.subtitulo} />
        </Revelar>
        <div className={`sobre-grade ${temInfo ? "" : "sobre-sozinho"}`}>
          <Revelar className="sobre-texto">
            {textos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Revelar>
          {temInfo && (
            <Revelar atraso={120}>
              <aside className="sobre-cartao" aria-label="Informações rápidas">
                <ul>
                  {perfil.disponivel && (
                    <li>
                      <span className="hero-ponto" aria-hidden="true" />
                      <span>{perfil.textoDisponibilidade}</span>
                    </li>
                  )}
                  {perfil.localizacao && (
                    <li>
                      <FaMapMarkerAlt aria-hidden="true" />
                      <span>{perfil.localizacao}</span>
                    </li>
                  )}
                  {perfil.email && (
                    <li>
                      <FaEnvelope aria-hidden="true" />
                      <a href={`mailto:${perfil.email}`}>{perfil.email}</a>
                    </li>
                  )}
                  {perfil.whatsapp && <li className="sobre-whatsapp"><FaWhatsapp aria-hidden="true" /><a href={`https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsapp)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${formatarWhatsAppBrasil(perfil.whatsapp)}`}>{formatarWhatsAppBrasil(perfil.whatsapp)}</a></li>}
                  {perfil.curriculo && (
                    <li>
                      <FaDownload aria-hidden="true" />
                      <a href={perfil.curriculo} target="_blank" rel="noopener noreferrer">Baixar currículo</a>
                    </li>
                  )}
                </ul>
              </aside>
            </Revelar>
          )}
        </div>
      </div>
    </section>
  );
}
