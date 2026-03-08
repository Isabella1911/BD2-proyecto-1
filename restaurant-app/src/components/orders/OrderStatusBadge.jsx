function OrderStatusBadge({ status }) {
  const statusStyles = {
    entregado: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-bg)",
    },
    "en camino": {
      backgroundColor: "var(--color-muted)",
      color: "var(--color-bg)",
    },
    pendiente: {
      backgroundColor: "var(--color-dark)",
      color: "var(--color-bg)",
    },
    cancelado: {
      backgroundColor: "#8b3a3a",
      color: "#ffffff",
    },
  };

  const currentStyle = statusStyles[status?.toLowerCase()] || {
    backgroundColor: "var(--color-dark)",
    color: "var(--color-bg)",
  };

  return (
    <span
      style={{
        ...currentStyle,
        padding: "0.4rem 0.8rem",
        borderRadius: "999px",
        fontWeight: "bold",
        fontSize: "0.9rem",
      }}
    >
      {status}
    </span>
  );
}

export default OrderStatusBadge;