import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleViewRestaurant = () => {
    navigate(`/restaurants/${restaurant.id}`);
  };

  return (
    <article
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-soft)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={restaurant.image}
        alt={restaurant.name}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            alignItems: "start",
            marginBottom: "0.75rem",
          }}
        >
          <h3 style={{ color: "var(--color-primary)" }}>{restaurant.name}</h3>

          <span
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
              padding: "0.35rem 0.6rem",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            ★ {restaurant.rating}
          </span>
        </div>

        <p
          style={{
            color: "var(--color-muted)",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          {restaurant.cuisine}
        </p>

        <p style={{ lineHeight: 1.5, marginBottom: "0.5rem" }}>
          ! {restaurant.address}
        </p>

        <p style={{ lineHeight: 1.5, marginBottom: "1rem" }}>
           {restaurant.deliveryTime}
        </p>

        <button
          onClick={handleViewRestaurant}
          style={{
            width: "100%",
            padding: "0.9rem",
            backgroundColor: "var(--color-dark)",
            color: "var(--color-bg)",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Ver restaurante
        </button>
      </div>
    </article>
  );
}

export default RestaurantCard;