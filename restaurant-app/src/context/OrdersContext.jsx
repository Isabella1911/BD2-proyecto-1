// =====================================================
// Context: Órdenes
// Reemplaza: src/context/OrdersContext.jsx
// =====================================================

import { createContext, useContext, useEffect, useState } from "react";
import { currentUser } from "../data/currentUser";
import {
  createOrder as createOrderApi,
  getOrdersByUserId,
} from "../services/orderService";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga las órdenes del usuario al montar
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
  }, []);

  // Crea una orden en MongoDB y la agrega al estado local
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

    // Normaliza para que el frontend lo consuma igual que antes
    const normalized = {
      id: newOrder._id,
      usuario_id: currentUser.id,
      restaurantId: restaurante_id,
      restaurant: restaurante_nombre,
      date: newOrder.fecha_pedido,
      total: monto_total,
      status: "pendiente",
      items: items.map((i) => i.nombre),
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
