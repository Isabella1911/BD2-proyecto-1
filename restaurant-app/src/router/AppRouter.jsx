import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../pages/Home";
import Rankings from "../pages/Rankings";
import History from "../pages/History";

import RestaurantDetails from "../pages/RestaurantDetails";
import OrderDetails from "../pages/OrderDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import RestaurantReviews from "../pages/RestaurantReviews";
import LoginScreen from "../pages/LoginScreen";
import RestaurantOrders from "../pages/RestaurantOrders";

import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateRestaurantPage from "../pages/admin/CreateRestaurantPage";
import UpdateOrderStatusPage from "../pages/admin/UpdateOrderStatusPage";
import DeleteReviewPage from "../pages/admin/DeleteReviewPage";
import CountRestaurantOrdersPage from "../pages/admin/CountRestaurantOrdersPage";
import PushItemPage from "../pages/admin/PushItemPage";
import RemoveArrayItemPage from "../pages/admin/RemoveArrayItemPage";
import AddUniqueItemPage from "../pages/admin/AddUniqueItemPage";
import UpdateReferencedDocsPage from "../pages/admin/UpdateReferencedDocsPage";

import ProtectedUserRoute from "./ProtectedUserRoute";
import UserAppProviders from "./UserAppProviders";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="create-restaurant" element={<CreateRestaurantPage />} />
        <Route path="update-referenced" element={<UpdateReferencedDocsPage />} />
        <Route path="update-order-status" element={<UpdateOrderStatusPage />} />
        <Route path="delete-review" element={<DeleteReviewPage />} />
        <Route path="count-orders" element={<CountRestaurantOrdersPage />} />
        <Route path="push-item" element={<PushItemPage />} />
        <Route path="remove-array-item" element={<RemoveArrayItemPage />} />
        <Route path="add-unique-item" element={<AddUniqueItemPage />} />
      </Route>

      <Route
        element={
          <ProtectedUserRoute>
            <UserAppProviders />
          </ProtectedUserRoute>
        }
      >
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="history" element={<History />} />
          <Route path="restaurants/:id" element={<RestaurantDetails />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="restaurants/:id/reviews" element={<RestaurantReviews />} />
          <Route path="restaurants/:id/orders" element={<RestaurantOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;