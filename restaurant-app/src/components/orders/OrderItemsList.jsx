function OrderItemsList({ items }) {
  return (
    <section
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-soft)",
        marginBottom: "1.5rem",
      }}
    >
      <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
        Artículos de la orden
      </h2>

      <div style={{ display: "grid", gap: "1rem" }}>
        {items.map((item, index) => (
          <article
            key={`${item.articulo_id}-${index}`}
            style={{
              backgroundColor: "#fffaf0",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              border: "2px solid var(--color-muted)",
            }}
          >
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
              <span style={{ fontWeight: "bold" }}>
                Q{item.precio_unitario}
              </span>
            </div>

            <p><strong>Cantidad:</strong> {item.cantidad}</p>
            <p>
              <strong>Subtotal:</strong> Q{item.precio_unitario * item.cantidad}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OrderItemsList;