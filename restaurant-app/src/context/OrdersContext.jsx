import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  createOrder as createOrderApi,
  getOrdersByUserId,
} from "../services/orderService";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser?.id) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const data = await getOrdersByUserId(currentUser.id);
        setOrders(data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [currentUser?.id]);

  const createOrder = async ({
    restaurante_id,
    restaurante_nombre,
    items,
    monto_total,
    direccion_entrega,
    metodo_pago,
  }) => {
    if (!currentUser?.id) {
      throw new Error("No hay usuario autenticado");
    }

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
      id: newOrder._id || newOrder.id,
      usuario_id: currentUser.id,
      restaurante_id,
      restaurante_nombre,
      fecha_pedido: newOrder.fecha_pedido,
      monto_total,
      estado: newOrder.estado || "Pendiente",
      items,
    };

    setOrders((prev) => [normalized, ...prev]);
    return normalized;
  };

  const userOrders = orders;

  return (
    <OrdersContext.Provider
      value={{ orders, userOrders, createOrder, isLoading }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}