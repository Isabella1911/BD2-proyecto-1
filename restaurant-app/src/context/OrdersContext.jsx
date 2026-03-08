import { createContext, useContext, useMemo, useState } from "react";
import { orders as initialOrders } from "../data/ordersMockData";
import { currentUser } from "../data/currentUser";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);

  const userOrders = useMemo(() => {
    return orders.filter((order) => order.usuario_id === currentUser.id);
  }, [orders]);

  const createOrder = ({
    restaurante_id,
    restaurante_nombre,
    items,
    monto_total,
    direccion_entrega,
    metodo_pago,
  }) => {
    const newOrder = {
      id: Date.now(),
      usuario_id: currentUser.id,
      restaurante_id,
      restaurante_nombre,
      fecha_pedido: new Date().toLocaleString("es-GT"),
      estado: "pendiente",
      monto_total,
      direccion_entrega,
      metodo_pago,
      items: items.map((item) => ({
        articulo_id: item.articulo_id,
        nombre: item.nombre,
        precio_unitario: item.precio_unitario,
        cantidad: item.cantidad,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const value = {
    orders,
    userOrders,
    createOrder,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}