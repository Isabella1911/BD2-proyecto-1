// =====================================================
// main.jsx — Punto de entrada del frontend
// Reemplaza: src/main.jsx
// =====================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import LoginScreen from "./pages/LoginScreen";
import "./styles/globals.css";

// Wrapper que decide si mostrar la app o el login
function AppWithAuth() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  // Solo monta los contextos que dependen del usuario cuando ya está logueado
  return (
    <OrdersProvider>
      <ReviewsProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ReviewsProvider>
    </OrdersProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);