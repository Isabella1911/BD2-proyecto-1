import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OrderStatusBadge from "../orders/OrderStatusBadge";
import ReviewModal from "../reviews/ReviewModal";
import { useReviews } from "../../context/ReviewsContext";

function OrderCard({ order }) {
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { createReview, hasUserReviewedOrder } = useReviews();

  const isDelivered = order.status?.toLowerCase() === "entregado";
  const alreadyReviewed = hasUserReviewedOrder(order.id);

  const handleSubmitReview = (reviewData) => {
    const result = createReview({
      restaurante_id: order.restaurantId,
      restaurante_nombre: order.restaurant,
      orden_id: order.id,
      calificacion_num: reviewData.calificacion_num,
      comentario: reviewData.comentario,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Gracias por tu reseña.");
    setShowReviewModal(false);
  };

  return (
    <>
      <article
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "0.8rem",
          }}
        >
          <div>
            <h3 style={{ color: "var(--color-primary)", marginBottom: "0.3rem" }}>
              {order.restaurant}
            </h3>
            <p style={{ color: "var(--color-muted)" }}>{order.date}</p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Total:</strong> Q{order.total}
        </p>

        <p style={{ marginBottom: "0.75rem" }}>
          <strong>Items:</strong> {order.items.join(", ")}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            style={buttonStyle}
          >
            Ver detalle
          </button>

          {isDelivered && !alreadyReviewed && (
            <button
              onClick={() => setShowReviewModal(true)}
              style={{ ...buttonStyle, backgroundColor: "var(--color-primary)" }}
            >
              Califícanos
            </button>
          )}

          {isDelivered && alreadyReviewed && (
            <span
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-muted)",
                color: "var(--color-bg)",
                fontWeight: "bold",
              }}
            >
              Ya calificaste este pedido
            </span>
          )}
        </div>
      </article>

      {showReviewModal && (
        <ReviewModal
          title={`Reseñar pedido #${order.id}`}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </>
  );
}

const buttonStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "var(--radius-md)",
  backgroundColor: "var(--color-dark)",
  color: "var(--color-bg)",
  fontWeight: "bold",
  border: "none",
};

export default OrderCard;