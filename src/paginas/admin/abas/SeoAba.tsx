import { CampoArea, CampoTexto, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function SeoAba({ dados, atualizar }: PropsAba) {
  const { titulo, descricao } = dados.seo;
  return (
    <>
      <TituloAba titulo="Google e compartilhamento" descricao="Como o seu portfólio aparece nas buscas e quando o link é enviado no WhatsApp, LinkedIn etc." />
      <div className="painel-cartao">
        <CampoTexto rotulo="Título da página" dica={`${titulo.length}/60 caracteres (ideal: até 60)`} valor={titulo} onChange={(v) => atualizar((d) => { d.seo.titulo = v; })} />
        <CampoArea rotulo="Descrição" dica={`${descricao.length}/160 caracteres (ideal: até 160)`} markdown={false} linhas={3} valor={descricao} onChange={(v) => atualizar((d) => { d.seo.descricao = v; })} />
      </div>
      <div className="painel-cartao">
        <h3>Prévia no Google</h3>
        <div className="previa-google">
          <span className="previa-google-url">seusite.com.br</span>
          <strong>{titulo || "Título da página"}</strong>
          <p>{descricao || "A descrição aparece aqui."}</p>
        </div>
      </div>
    </>
  );
}
