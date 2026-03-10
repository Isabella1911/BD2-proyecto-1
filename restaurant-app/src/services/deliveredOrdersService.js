// =====================================================
// Servicio: Órdenes entregadas de un restaurante (Frontend)
// Archivo nuevo: src/services/deliveredOrdersService.js
// =====================================================

import { API_URL } from "./api";

// Ordenamiento + Proyección + Paginación desde el backend
export async function getDeliveredOrdersByRestaurant(restaurantId, page = 1, limit = 10) {
  const params = new URLSearchParams({ page, limit });
  const res = await fetch(`${API_URL}/ordenes/restaurante/${restaurantId}/entregadas?${params}`);
  if (!res.ok) throw new Error("Error al cargar órdenes entregadas");
  return await res.json();
  // Devuelve: { orders: [...], total, page, totalPages }
}