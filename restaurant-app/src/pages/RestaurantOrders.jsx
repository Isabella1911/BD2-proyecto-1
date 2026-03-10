// =====================================================
// Página: Órdenes Entregadas de un Restaurante
// Ruta: /restaurants/:id/orders
// Archivo nuevo: src/pages/RestaurantOrders.jsx
// =====================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import { getRestaurantById } from "../services/restaurantService";
import { getDeliveredOrdersByRestaurant } from "../services/deliveredOrdersService";

function RestaurantOrders() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant]   = useState(null);
  const [orders, setOrders]           = useState([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading]     = useState(true);

  const limit = 10;

  useEffect(() => {
    getRestaurantById(id).then(setRestaurant);
  }, [id]);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const data = await getDeliveredOrdersByRestaurant(id, currentPage, limit);
        setOrders(data.orders);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [id, currentPage]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <PageHeader
        title={restaurant ? `Órdenes entregadas · ${restaurant.name}` : "Órdenes entregadas"}
        subtitle={`${total} órdenes en total · ordenadas por fecha descendente`}
      />

      {/* Botón volver */}
      <button
        onClick={() => navigate(`/restaurants/${id}`)}
        style={{
          marginBottom: "1.5rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "transparent",
          border: "1.5px solid var(--color-muted)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          color: "var(--color-dark)",
          fontWeight: "bold",
        }}
      >
        ← Volver al restaurante
      </button>

      {isLoading ? (
        <LoadingSpinner text="Cargando órdenes..." />
      ) : orders.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <p style={{ color: "var(--color-muted)" }}>
            Este restaurante aún no tiene órdenes entregadas.
          </p>
        </div>
      ) : (
        <>
          {/* Tabla */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-soft)",
              overflowX: "auto",
              marginBottom: "1.5rem",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-bg)",
                  }}
                >
                  {["# Orden", "Fecha", "Artículos", "Total (Q)", "Método de pago", "Dirección"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: "0.85rem 1rem",
                          textAlign: "left",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          fontSize: "0.9rem",
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    style={{
                      backgroundColor:
                        idx % 2 === 0 ? "var(--color-bg)" : "var(--color-surface)",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontWeight: "bold", color: "var(--color-primary)", fontSize: "0.85rem" }}>
                      {order._id}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                      {formatDate(order.fecha_pedido)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {order.items.map((item, i) => (
                          <li key={i} style={{ fontSize: "0.85rem", color: "var(--color-dark)" }}>
                            {item.cantidad}× {item.nombre}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: "bold" }}>
                      Q{order.monto_total?.toFixed(2)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.9rem" }}>
                      {order.metodo_pago}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--color-muted)" }}>
                      {order.direccion_entrega}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default RestaurantOrders;