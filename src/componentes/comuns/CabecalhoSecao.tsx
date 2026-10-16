interface Props {
  rotulo?: string;
  titulo: string;
  subtitulo?: string;
  id?: string;
}

export default function CabecalhoSecao({ rotulo, titulo, subtitulo, id }: Props) {
  return (
    <header className="cabecalho-secao">
      {rotulo && <span className="cabecalho-rotulo">{rotulo}</span>}
      <h2 id={id}>{titulo}</h2>
      {subtitulo && <p>{subtitulo}</p>}
    </header>
  );
}
