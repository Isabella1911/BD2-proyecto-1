import { Outlet, Link, useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/create-restaurant", label: "Crear restaurante" },
    { to: "/admin/update-referenced", label: "Actualizar referenced" },
    { to: "/admin/update-order-status", label: "Cambiar estado orden" },
    { to: "/admin/delete-review", label: "Eliminar reseña" },
    { to: "/admin/count-orders", label: "Contar órdenes" },
    { to: "/admin/push-item", label: "Push artículo" },
    { to: "/admin/remove-array-item", label: "Eliminar artículo array" },
    { to: "/admin/add-unique-item", label: "Agregar sin duplicados" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <aside style={{ width: "280px", padding: "1rem", background: "#1f2937", color: "white" }}>
        <h2>Admin Panel</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: "white",
                textDecoration: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                background: location.pathname === link.to ? "#374151" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link to="/login" style={{ color: "#fca5a5", display: "inline-block", marginTop: "1rem" }}>
          Volver al login
        </Link>
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;