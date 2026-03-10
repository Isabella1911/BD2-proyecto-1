// =====================================================
// Context: Órdenes
// Reemplaza: src/context/OrdersContext.jsx
// =====================================================

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  createOrder as createOrderApi,
  getOrdersByUserId,
} from "../services/orderService";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const { currentUser } = useAuth();
  const [orders, setOrders]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga las órdenes del usuario al montar (currentUser ya existe aquí)
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrdersByUserId(currentUser.id);
        setOrders(data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [currentUser.id]);

  const createOrder = async ({
    restaurante_id,
    restaurante_nombre,
    items,
    monto_total,
    direccion_entrega,
    metodo_pago,
  }) => {
    const newOrder = await createOrderApi({
      usuario_id: currentUser.id,
      restaurante_id,
      restaurante_nombre,
      items,
      monto_total,
      direccion_entrega,
      metodo_pago,
    });

    const normalized = {
      id: newOrder._id,
      usuario_id: currentUser.id,
      restaurante_id,
      restaurante_nombre,
      fecha_pedido: newOrder.fecha_pedido,
      monto_total,
      estado: "Pendiente",
      items: items,
    };

    setOrders((prev) => [normalized, ...prev]);
    return normalized;
  };

  const userOrders = orders.filter(
    (order) => order.usuario_id === currentUser.id
  );

  return (
    <OrdersContext.Provider value={{ orders, userOrders, createOrder, isLoading }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}