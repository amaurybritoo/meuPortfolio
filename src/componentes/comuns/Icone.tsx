import { ICONES, ICONE_PADRAO } from "../../utilitarios/icones";

interface Props {
  nome: string;
  className?: string;
}

/** Mostra o ícone pelo nome salvo no admin (ex.: "react", "github"). */
export default function Icone({ nome, className }: Props) {
  const Componente = ICONES[nome] ?? ICONE_PADRAO;
  return <Componente className={className} aria-hidden="true" focusable="false" />;
}
