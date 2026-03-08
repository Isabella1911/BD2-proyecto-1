import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import OrderSummaryCard from "../components/orders/OrderSummaryCard";
import OrderItemsList from "../components/orders/OrderItemsList";
import PaymentInfo from "../components/orders/PaymentInfo";
import ReviewModal from "../components/reviews/ReviewModal";
import { useReviews } from "../context/ReviewsContext";
import { useOrders } from "../context/OrdersContext";

function OrderDetails() {
  const { id } = useParams();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { orders } = useOrders();
  const { createReview, hasUserReviewedOrder } = useReviews();

  const order = useMemo(() => {
    return orders.find((item) => item.id === Number(id)) || null;
  }, [orders, id]);

  if (!orders) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <LoadingSpinner text="Cargando orden..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>
            Orden no encontrada
          </h2>
          <p>No existe una orden con ese id.</p>
        </div>
      </div>
    );
  }

  const isDelivered = order.estado?.toLowerCase() === "entregado";
  const alreadyReviewed = hasUserReviewedOrder(order.id);

  const handleSubmitReview = (reviewData) => {
    const result = createReview({
      restaurante_id: order.restaurante_id,
      restaurante_nombre: order.restaurante_nombre,
      orden_id: order.id,
      calificacion_num: reviewData.calificacion_num,
      comentario: reviewData.comentario,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Reseña guardada correctamente.");
    setShowReviewModal(false);
  };

  return (
    <>
      <div className="container" style={{ padding: "2rem 0" }}>
        <OrderSummaryCard order={order} />
        <OrderItemsList items={order.items} />
        <PaymentInfo method={order.metodo_pago} />

        {isDelivered && !alreadyReviewed && (
          <button
            onClick={() => setShowReviewModal(true)}
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.2rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
              fontWeight: "bold",
            }}
          >
            Califícanos
          </button>
        )}

        {isDelivered && alreadyReviewed && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.2rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-muted)",
              color: "var(--color-bg)",
              fontWeight: "bold",
              width: "fit-content",
            }}
          >
            Ya calificaste este pedido
          </div>
        )}
      </div>

      {showReviewModal && (
        <ReviewModal
          title={`Reseñar orden #${order.id}`}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </>
  );
}

export default OrderDetails;