import { useState } from "react";

function CheckoutForm({ onSubmitOrder }) {
  const [form, setForm] = useState({
    direccion_entrega: "",
    metodo_pago: "Tarjeta",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.direccion_entrega.trim()) {
      alert("Debes ingresar una dirección de entrega.");
      return;
    }

    onSubmitOrder(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
        Datos de entrega
      </h2>

      <div style={{ display: "grid", gap: "1rem" }}>
        <textarea
          value={form.direccion_entrega}
          onChange={(event) =>
            handleChange("direccion_entrega", event.target.value)
          }
          placeholder="Ingresa la dirección de entrega"
          rows="4"
          style={inputStyle}
        />

        <select
          value={form.metodo_pago}
          onChange={(event) => handleChange("metodo_pago", event.target.value)}
          style={inputStyle}
        >
          <option value="Tarjeta">Tarjeta</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "1rem",
            border: "none",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-bg)",
            fontWeight: "bold",
          }}
        >
          Confirmar pedido
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  padding: "0.9rem 1rem",
  borderRadius: "var(--radius-md)",
  border: "2px solid var(--color-muted)",
  backgroundColor: "#fffaf0",
  color: "var(--color-dark)",
  outline: "none",
  resize: "none",
};

export default CheckoutForm;