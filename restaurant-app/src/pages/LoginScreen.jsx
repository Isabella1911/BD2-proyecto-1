import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginScreen() {
  const { login, loginError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim()) return;
    await login(email.trim());
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleAdminLogin = () => {
    navigate("/admin");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
          boxShadow: "var(--shadow-soft)",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "var(--color-primary)", marginBottom: "0.25rem" }}>
            🍽️ FoodApp
          </h1>
          <p style={{ color: "var(--color-muted)" }}>
            Ingresa tu email para continuar
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "var(--color-dark)",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="usuario@ejemplo.com"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1.5px solid var(--color-muted)",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {loginError && (
          <p
            style={{
              color: "#e53e3e",
              fontSize: "0.9rem",
              marginBottom: "1rem",
            }}
          >
            {loginError}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !email.trim()}
          style={{
            width: "100%",
            padding: "0.9rem",
            backgroundColor:
              isLoading || !email.trim()
                ? "var(--color-muted)"
                : "var(--color-primary)",
            color: "var(--color-bg)",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: isLoading || !email.trim() ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Buscando..." : "Entrar"}
        </button>

        <button
          onClick={handleAdminLogin}
          style={{
            width: "100%",
            padding: "0.9rem",
            marginTop: "0.8rem",
            backgroundColor: "transparent",
            color: "var(--color-primary)",
            border: "2px solid var(--color-primary)",
            borderRadius: "var(--radius-md)",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Entrar como Admin
        </button>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.8rem",
            color: "var(--color-muted)",
            textAlign: "center",
          }}
        >
          Usa cualquier email de los 500 usuarios generados en la base de datos.
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;