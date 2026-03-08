import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartSummary() {
  const navigate = useNavigate();
  const { cartItems, cartRestaurant, totalItems, totalAmount } = useCart();

  return (
    <section
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-soft)",
        height: "fit-content",
      }}
    >
      <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
        Resumen
      </h2>

      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Restaurante:</strong> {cartRestaurant || "Sin selección"}
      </p>

      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Artículos:</strong> {totalItems}
      </p>

      <p style={{ marginBottom: "1rem" }}>
        <strong>Total:</strong> Q{totalAmount}
      </p>

      <button
        onClick={() => navigate("/checkout")}
        disabled={!cartItems.length}
        style={{
          width: "100%",
          padding: "1rem",
          border: "none",
          borderRadius: "var(--radius-md)",
          backgroundColor: cartItems.length
            ? "var(--color-primary)"
            : "var(--color-muted)",
          color: "var(--color-bg)",
          fontWeight: "bold",
          cursor: cartItems.length ? "pointer" : "not-allowed",
        }}
      >
        Ir al checkout
      </button>
    </section>
  );
}

export default CartSummary;