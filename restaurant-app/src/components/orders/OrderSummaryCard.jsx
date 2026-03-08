import OrderStatusBadge from "./OrderStatusBadge";

function OrderSummaryCard({ order }) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ color: "var(--color-primary)", marginBottom: "0.4rem" }}>
            Orden #{order.id}
          </h1>
          <p><strong>Restaurante:</strong> {order.restaurante_nombre}</p>
          <p><strong>Fecha:</strong> {order.fecha_pedido}</p>
        </div>

        <OrderStatusBadge status={order.estado} />
      </div>

      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Total:</strong> Q{order.monto_total}
      </p>

      <p>
        <strong>Dirección de entrega:</strong> {order.direccion_entrega}
      </p>
    </section>
  );
}

export default OrderSummaryCard;