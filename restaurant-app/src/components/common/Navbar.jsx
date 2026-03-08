import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { totalItems } = useCart();

  const navLinkStyle = ({ isActive }) => ({
    padding: "0.7rem 1rem",
    borderRadius: "var(--radius-md)",
    fontWeight: "bold",
    color: isActive ? "var(--color-bg)" : "var(--color-dark)",
    backgroundColor: isActive ? "var(--color-primary)" : "transparent",
    transition: "0.2s ease-in-out",
  });

  return (
    <header
      style={{
        backgroundColor: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ color: "var(--color-primary)", marginBottom: "0.2rem" }}>
            FoodApp
          </h2>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
            Pedidos y reseñas
          </p>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <NavLink to="/" style={navLinkStyle}>
            Inicio
          </NavLink>

          <NavLink to="/rankings" style={navLinkStyle}>
            Rankings
          </NavLink>

          <NavLink to="/history" style={navLinkStyle}>
            Historial
          </NavLink>

          <NavLink to="/settings" style={navLinkStyle}>
            Settings
          </NavLink>

          <NavLink to="/cart" style={navLinkStyle}>
            Carrito ({totalItems})
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;