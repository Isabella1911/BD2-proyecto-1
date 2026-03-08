import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrdersProvider>
        <ReviewsProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ReviewsProvider>
      </OrdersProvider>
    </BrowserRouter>
  </React.StrictMode>
);