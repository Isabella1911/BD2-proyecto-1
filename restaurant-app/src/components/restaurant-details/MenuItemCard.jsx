import { useState } from "react";
import { useCart } from "../../context/CartContext";
import QuantityModal from "./QuantityModal";

function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    if (!item.available) return;
    setShowModal(true);
  };

  const handleConfirmQuantity = (quantity) => {
    addToCart(restaurantId, restaurantName, item, quantity);
    setShowModal(false);
  };

  return (
    <>
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
          src={item.image_url}
          alt={item.name}
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
              marginBottom: "0.75rem",
            }}
          >
            <h3 style={{ color: "var(--color-primary)" }}>{item.name}</h3>
            <span style={{ fontWeight: "bold", color: "var(--color-dark)" }}>
              Q{item.price}
            </span>
          </div>

          <p
            style={{
              color: "var(--color-muted)",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            {item.category}
          </p>

          <p style={{ lineHeight: 1.5, marginBottom: "0.75rem" }}>
            {item.description}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.4rem 0.75rem",
                borderRadius: "999px",
                backgroundColor: item.available
                  ? "var(--color-primary)"
                  : "var(--color-muted)",
                color: "var(--color-bg)",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {item.available ? "Disponible" : "No disponible"}
            </span>

            <button
              onClick={handleOpenModal}
              disabled={!item.available}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: item.available
                  ? "var(--color-dark)"
                  : "var(--color-muted)",
                color: "var(--color-bg)",
                fontWeight: "bold",
                cursor: item.available ? "pointer" : "not-allowed",
              }}
            >
              Agregar
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <QuantityModal
          itemName={item.name}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmQuantity}
        />
      )}
    </>
  );
}

export default MenuItemCard;