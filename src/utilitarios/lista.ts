// Ajudas para listas editáveis do admin (mover, remover, duplicar).

export function moverItem<T>(lista: T[], indice: number, passo: number): void {
  const destino = indice + passo;
  if (destino < 0 || destino >= lista.length) return;
  const [item] = lista.splice(indice, 1);
  lista.splice(destino, 0, item);
}

export function removerItem<T>(lista: T[], indice: number): void {
  lista.splice(indice, 1);
}
