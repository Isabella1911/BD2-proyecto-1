import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import CheckoutForm from "../components/cart/CheckoutForm";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";

function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartRestaurant,
    totalItems,
    totalAmount,
    clearCart,
  } = useCart();

  const { createOrder } = useOrders();

  const handleSubmitOrder = (formData) => {
    const restaurantId = cartItems.length > 0 ? cartItems[0].restaurantId : null;

    const newOrder = createOrder({
      restaurante_id: restaurantId,
      restaurante_nombre: cartRestaurant,
      items: cartItems,
      monto_total: totalAmount,
      direccion_entrega: formData.direccion_entrega,
      metodo_pago: formData.metodo_pago,
    });

    console.log("Nueva orden creada:", newOrder);

    alert("Pedido confirmado correctamente.");
    clearCart();
    navigate("/history");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <PageHeader
          title="Checkout"
          subtitle="Completa tu pedido."
        />

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
            No hay productos en el carrito
          </h2>
          <p>Debes agregar artículos antes de continuar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <PageHeader
        title="Checkout"
        subtitle="Confirma tu dirección y método de pago."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "1.5rem",
        }}
      >
        <CheckoutForm onSubmitOrder={handleSubmitOrder} />

        <section
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-soft)",
            height: "fit-content",
          }}
        >
          <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
            Resumen del pedido
          </h2>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Restaurante:</strong> {cartRestaurant}
          </p>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Artículos:</strong> {totalItems}
          </p>

          <p style={{ marginBottom: "1rem" }}>
            <strong>Total:</strong> Q{totalAmount}
          </p>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {cartItems.map((item) => (
              <div
                key={item.articulo_id}
                style={{
                  padding: "0.8rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#fffaf0",
                  border: "2px solid var(--color-muted)",
                }}
              >
                <strong>{item.nombre}</strong>
                <p>Cantidad: {item.cantidad}</p>
                <p>Subtotal: Q{item.precio_unitario * item.cantidad}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;