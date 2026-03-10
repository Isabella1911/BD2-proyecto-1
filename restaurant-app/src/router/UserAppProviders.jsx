import { OrdersProvider } from "../context/OrdersContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { CartProvider } from "../context/CartContext";
import { Outlet } from "react-router-dom";

function UserAppProviders() {
  return (
    <OrdersProvider>
      <ReviewsProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </ReviewsProvider>
    </OrdersProvider>
  );
}

export default UserAppProviders;