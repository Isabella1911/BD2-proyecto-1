import { useState } from "react";

function QuantityModal({ itemName, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "min(90%, 400px)",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h2 style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }}>
          Seleccionar cantidad
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          Artículo: <strong>{itemName}</strong>
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <button onClick={decrease} style={btnStyle}>-</button>
          <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{quantity}</span>
          <button onClick={increase} style={btnStyle}>+</button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...btnStyle, backgroundColor: "var(--color-muted)" }}>
            Cancelar
          </button>
          <button onClick={() => onConfirm(quantity)} style={btnStyle}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "0.75rem 1rem",
  border: "none",
  borderRadius: "var(--radius-md)",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-bg)",
  fontWeight: "bold",
};

export default QuantityModal;