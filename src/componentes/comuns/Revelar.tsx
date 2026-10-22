import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** atraso da animação em milissegundos (para itens em sequência) */
  atraso?: number;
}

/** Faz o conteúdo aparecer suavemente quando entra na tela. */
export default function Revelar({ children, className = "", atraso = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // sem IntersectionObserver (navegador muito antigo) o conteúdo já nasce visível
  const [visivel, setVisivel] = useState(() => !("IntersectionObserver" in window));

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={ref} className={`revelar ${visivel ? "visivel" : ""} ${className}`.trim()} style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}>
      {children}
    </div>
  );
}
