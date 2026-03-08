import PageHeader from "../components/common/PageHeader";
import CartItemCard from "../components/cart/CartItemCard";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems } = useCart();

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <PageHeader
        title="Carrito"
        subtitle="Revisa los artículos seleccionados antes de confirmar tu pedido."
      />

      {cartItems.length === 0 ? (
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
            Tu carrito está vacío
          </h2>
          <p>Agrega artículos desde el menú de un restaurante.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "grid", gap: "1rem" }}>
            {cartItems.map((item) => (
              <CartItemCard key={item.articulo_id} item={item} />
            ))}
          </div>

          <CartSummary />
        </div>
      )}
    </div>
  );
}

export default Cart;