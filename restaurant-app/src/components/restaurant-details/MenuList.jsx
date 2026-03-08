import MenuItemCard from "./MenuItemCard";

function MenuList({ items, restaurantId, restaurantName }) {
  if (!items.length) {
    return (
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-soft)",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          Este restaurante no tiene artículos
        </h3>
        <p>No hay elementos disponibles para mostrar.</p>
      </div>
    );
  }

  return (
    <section>
      <h2
        style={{
          color: "var(--color-primary)",
          marginBottom: "1rem",
        }}
      >
        Menú
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            restaurantId={restaurantId}
            restaurantName={restaurantName}
          />
        ))}
      </div>
    </section>
  );
}

export default MenuList;