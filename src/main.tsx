import { Component, StrictMode } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./estilos/global.css";
import { ocultarTelaCarregamento } from "./utilitarios/telaCarregamento";

class LimiteDeErro extends Component<{ children: ReactNode }, { falhou: boolean }> {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  componentDidCatch() {
    ocultarTelaCarregamento();
  }

  render() {
    if (this.state.falhou) {
      return (
        <main className="erro-aplicacao" role="alert">
          <div>
            <h1>Não foi possível abrir o portfólio</h1>
            <p>Ocorreu uma falha ao carregar a página. Tente novamente.</p>
            <button type="button" onClick={() => window.location.reload()}>Recarregar página</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LimiteDeErro>
      <App />
    </LimiteDeErro>
  </StrictMode>,
);
