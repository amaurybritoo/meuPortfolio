import "../estilos/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="logo" />
        <span>Amaury.dev</span>
      </div>

      <div className="menu">
        <a href="#projetos">Projetos</a>
        <a href="#contato">Contato</a>
      </div>
    </nav>
  );
}