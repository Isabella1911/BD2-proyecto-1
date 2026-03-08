function RestaurantInfo({ totalItems }) {
  return (
    <section
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        boxShadow: "var(--shadow-soft)",
        marginBottom: "1.5rem",
      }}
    >
      <h2
        style={{
          color: "var(--color-primary)",
          marginBottom: "0.75rem",
        }}
      >
        Información del menú
      </h2>

      <p style={{ color: "var(--color-dark)" }}>
        Este restaurante tiene <strong>{totalItems}</strong> artículo(s) disponibles en su menú.
      </p>
    </section>
  );
}

export default RestaurantInfo;