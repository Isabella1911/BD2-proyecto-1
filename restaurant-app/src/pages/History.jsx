import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import HistoryTabs from "../components/history/HistoryTabs";
import OrderCard from "../components/history/OrderCard";
import ReviewCard from "../components/history/ReviewCard";
import { useOrders } from "../context/OrdersContext";
import { useReviews } from "../context/ReviewsContext";

function History() {
  const [activeTab, setActiveTab] = useState("orders");
  const { userOrders } = useOrders();
  const { userReviews } = useReviews();

  const mappedOrders = useMemo(() => {
    return userOrders.map((order) => ({
      id: order.id,
      restaurant: order.restaurante_nombre,
      restaurantId: order.restaurante_id,
      date: order.fecha_pedido,
      total: order.monto_total,
      status: order.estado,
      items: order.items.map((item) => item.nombre),
    }));
  }, [userOrders]);

  const mappedReviews = useMemo(() => {
    return userReviews.map((review) => ({
      id: review.id,
      restaurant: review.restaurante_nombre,
      date: review.fecha,
      rating: review.calificacion_num,
      comment: review.comentario,
    }));
  }, [userReviews]);

  const currentList = activeTab === "orders" ? mappedOrders : mappedReviews;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <PageHeader
        title="Historial"
        subtitle="Consulta tus pedidos anteriores y las reseñas que has realizado."
      />

      <HistoryTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {currentList.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-soft)",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>
            No hay información disponible
          </h3>
          <p style={{ color: "var(--color-dark)" }}>
            Aún no tienes elementos en esta sección.
          </p>
        </div>
      ) : (
        <section
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          {activeTab === "orders"
            ? mappedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            : mappedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
        </section>
      )}
    </div>
  );
}

export default History;