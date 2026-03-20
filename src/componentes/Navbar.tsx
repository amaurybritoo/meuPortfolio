import "../estilos/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Amaury.dev</div>

      <div className="menu">
        <a href="#projetos">Projetos</a>
        <a href="#contato">Contato</a>
      </div>
    </nav>
  );
}