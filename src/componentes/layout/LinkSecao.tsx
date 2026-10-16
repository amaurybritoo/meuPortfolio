import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  id: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

/** Link para uma seção da página inicial: rola suavemente se já estiver nela, ou volta para ela. */
export default function LinkSecao({ id, className, children, onClick }: Props) {
  const { pathname } = useLocation();

  const aoClicar = (evento: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (pathname !== "/") return; // em outra página, o <Link> navega até "/#secao"
    evento.preventDefault();
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <Link to={`/#${id}`} className={className} onClick={aoClicar}>
      {children}
    </Link>
  );
}
