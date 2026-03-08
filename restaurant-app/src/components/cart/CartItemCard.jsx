import { useCart } from "../../context/CartContext";

function CartItemCard({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <article
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1rem",
        boxShadow: "var(--shadow-soft)",
        display: "grid",
        gridTemplateColumns: "90px 1fr",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <img
        src={item.image_url}
        alt={item.nombre}
        style={{
          width: "90px",
          height: "90px",
          objectFit: "cover",
          borderRadius: "var(--radius-md)",
        }}
      />

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "0.5rem",
          }}
        >
          <h3 style={{ color: "var(--color-primary)" }}>{item.nombre}</h3>
          <strong>Q{item.precio_unitario * item.cantidad}</strong>
        </div>

        <p style={{ marginBottom: "0.75rem", color: "var(--color-muted)" }}>
          Q{item.precio_unitario} c/u
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button onClick={() => decreaseQuantity(item.articulo_id)} style={btnStyle}>
            -
          </button>

          <span style={{ fontWeight: "bold", minWidth: "24px", textAlign: "center" }}>
            {item.cantidad}
          </span>

          <button onClick={() => increaseQuantity(item.articulo_id)} style={btnStyle}>
            +
          </button>

          <button
            onClick={() => removeFromCart(item.articulo_id)}
            style={{
              ...btnStyle,
              backgroundColor: "#8b3a3a",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

const btnStyle = {
  padding: "0.5rem 0.8rem",
  border: "none",
  borderRadius: "var(--radius-md)",
  backgroundColor: "var(--color-dark)",
  color: "var(--color-bg)",
  fontWeight: "bold",
};

export default CartItemCard;