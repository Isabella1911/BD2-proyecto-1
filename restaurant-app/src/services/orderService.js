// =====================================================
// Servicio: Órdenes (Frontend)
// Reemplaza: src/services/orderService.js
// =====================================================

import { API_URL } from "./api";

// ── Usado en: OrdersContext → createOrder() ───────────
// Crea una orden con items embebidos en MongoDB
export async function createOrder(orderData) {
  const res = await fetch(`${API_URL}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Error al crear la orden");
  return await res.json();
}

// ── Usado en: OrdersContext, History.jsx ──────────────
// Historial de órdenes del usuario actual
export async function getOrdersByUserId(userId) {
  const res = await fetch(`${API_URL}/ordenes/usuario/${userId}`);
  if (!res.ok) throw new Error("Error al cargar órdenes");

  const data = await res.json();

  return data.map((o) => ({
    id: o._id,
    usuario_id: o.usuario_id,
    restaurantId: o.restaurante_id,
    restaurant: o.restaurante_nombre || o.restaurante_id,
    date: o.fecha_pedido,
    total: o.monto_total,
    status: o.estado?.toLowerCase(),
    items: o.items.map((item) => item.nombre),
  }));
}

// ── Usado en: OrderDetail.jsx ─────────────────────────
export async function getOrderById(orderId) {
  const res = await fetch(`${API_URL}/ordenes/${orderId}`);
  if (!res.ok) return null;

  const o = await res.json();

  return {
    id: o._id,
    usuario_id: o.usuario_id,
    restaurantId: o.restaurante_id,
    date: o.fecha_pedido,
    total: o.monto_total,
    status: o.estado?.toLowerCase(),
    direccion_entrega: o.direccion_entrega,
    metodo_pago: o.metodo_pago,
    items: o.items,
  };
}

// ── Usado en: seguimiento de orden / admin ────────────
// Cambia el estado de una orden específica
export async function updateOrderStatus(orderId, estado) {
  const res = await fetch(`${API_URL}/ordenes/${orderId}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error al actualizar estado");
  return await res.json();
}

// ── Usado en: detalle de orden (editar cantidad) ──────
// Actualiza la cantidad de un item embebido en la orden
export async function updateItemQuantity(orderId, articuloId, cantidad) {
  const res = await fetch(
    `${API_URL}/ordenes/${orderId}/items/${articuloId}/cantidad`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    }
  );
  if (!res.ok) throw new Error("Error al actualizar cantidad");
  return await res.json();
}