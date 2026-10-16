/** Esmaece a tela inicial depois que o conteúdo visível está pronto. */
export function ocultarTelaCarregamento(): void {
  const tela = document.getElementById("tela-carregamento-inicial");
  if (!tela || tela.classList.contains("pronta")) return;

  tela.classList.add("pronta");
  const remover = () => tela.remove();
  tela.addEventListener("transitionend", remover, { once: true });
  window.setTimeout(remover, 500);
}
