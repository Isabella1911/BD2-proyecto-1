import { Routes, Route } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../pages/Home";
import Rankings from "../pages/Rankings";
import History from "../pages/History";
import Settings from "../pages/Settings";
import RestaurantDetails from "../pages/RestaurantDetails";
import OrderDetails from "../pages/OrderDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import RestaurantReviews from "../pages/RestaurantReviews";
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="rankings" element={<Rankings />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="restaurants/:id" element={<RestaurantDetails />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="restaurants/:id/reviews" element={<RestaurantReviews />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;