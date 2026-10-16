import { CampoArea, CampoTexto, Interruptor, TituloAba } from "../campos";
import type { PropsAba } from "../tiposAdmin";

export default function ContatoAba({ dados, atualizar }: PropsAba) {
  const c = dados.contato;
  return (
    <>
      <TituloAba titulo="Contato" descricao="Textos da seção de contato. E-mail, WhatsApp e redes vêm da aba Perfil." />
      <div className="painel-cartao">
        <CampoTexto rotulo="Título" valor={c.titulo} onChange={(v) => atualizar((d) => { d.contato.titulo = v; })} />
        <CampoArea rotulo="Texto" linhas={3} valor={c.texto} onChange={(v) => atualizar((d) => { d.contato.texto = v; })} />
        <CampoArea rotulo="Mensagem padrão do WhatsApp" dica="É a mensagem que já vem escrita quando alguém te chama." linhas={2} valor={c.mensagemWhatsapp} onChange={(v) => atualizar((d) => { d.contato.mensagemWhatsapp = v; })} />
        <Interruptor rotulo="Mostrar formulário de mensagem" dica="Abre o WhatsApp ou o e-mail da pessoa com o texto já preenchido (não precisa de servidor)." valor={c.mostrarFormulario} onChange={(v) => atualizar((d) => { d.contato.mostrarFormulario = v; })} />
      </div>
    </>
  );
}
