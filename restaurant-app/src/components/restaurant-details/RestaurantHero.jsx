// =====================================================
// Componente: RestaurantHero
// Reemplaza: src/components/restaurant-details/RestaurantHero.jsx
// Cambio: agrega botón "Órdenes entregadas" al lado de "Ver reseñas"
// =====================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../common/StarRating";
import ReviewModal from "../reviews/ReviewModal";
import { useReviews } from "../../context/ReviewsContext";

function RestaurantHero({ restaurant }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  const {
    createReview,
    getAverageRatingByRestaurantId,
    getReviewsCountByRestaurantId,
  } = useReviews();

  const averageRating = getAverageRatingByRestaurantId(restaurant.id);
  const reviewsCount  = getReviewsCountByRestaurantId(restaurant.id);
  const displayRating = averageRating > 0 ? averageRating : restaurant.rating;

  const handleSubmitReview = async (reviewData) => {
    const result = await createReview({
      restaurante_id: restaurant.id,
      restaurante_nombre: restaurant.name,
      orden_id: null,
      calificacion_num: reviewData.calificacion_num,
      comentario: reviewData.comentario,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Reseña enviada correctamente.");
    setShowReviewModal(false);
  };

  return (
    <>
      <section
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-soft)",
          marginBottom: "1.5rem",
        }}
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          style={{ width: "100%", height: "280px", objectFit: "cover" }}
        />

        <div style={{ padding: "1.5rem" }}>
          <h1 style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }}>
            {restaurant.name}
          </h1>

          <p style={{ color: "var(--color-muted)", fontWeight: "bold", marginBottom: "0.5rem" }}>
            {restaurant.cuisine}
          </p>
          <p style={{ marginBottom: "0.5rem" }}>📍 {restaurant.address}</p>
          <p style={{ marginBottom: "0.75rem" }}>🕒 {restaurant.schedule}</p>

          <StarRating
            rating={displayRating}
            clickable
            onClick={() => setShowReviewModal(true)}
          />

          <p style={{ marginTop: "0.5rem", color: "var(--color-muted)" }}>
            {reviewsCount} reseña(s) · Toca las estrellas para dejar una reseña
          </p>

          {/* Botones — Ver reseñas + Órdenes entregadas */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <button
              onClick={() => navigate(`/restaurants/${restaurant.id}/reviews`)}
              style={{
                padding: "0.9rem 1.1rem",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "var(--color-dark)",
                color: "var(--color-bg)",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Ver reseñas
            </button>

            <button
              onClick={() => navigate(`/restaurants/${restaurant.id}/orders`)}
              style={{
                padding: "0.9rem 1.1rem",
                borderRadius: "var(--radius-md)",
                border: "2px solid var(--color-dark)",
                backgroundColor: "transparent",
                color: "var(--color-dark)",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              📦 Órdenes entregadas
            </button>
          </div>
        </div>
      </section>

      {showReviewModal && (
        <ReviewModal
          title={`Reseñar ${restaurant.name}`}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </>
  );
}

export default RestaurantHero;