// =====================================================
// Servicio: Restaurantes (Frontend)
// Reemplaza: src/services/restaurantService.js
// =====================================================

import { API_URL } from "./api";

// ── Usado en: Home.jsx ────────────────────────────────
// Trae todos los restaurantes para el listado y filtros
export async function getRestaurants() {
  const res = await fetch(`${API_URL}/restaurantes`);
  if (!res.ok) throw new Error("Error al cargar restaurantes");

  const data = await res.json();

  // Mapea los campos de MongoDB al formato que espera el frontend
  return data.map((r) => ({
    id: r._id,
    name: r.nombre,
    cuisine: r.tipo_cocina,
    rating: r.calificacion_promedio,
    address: r.direccion,
    schedule: r.horario,
    image: r.gridfs_imagen_id
      ? `${API_URL}/imagenes/restaurante/${r.gridfs_imagen_id}`
      : null,
  }));
}

// ── Usado en: RestaurantDetails.jsx, RestaurantReviews.jsx ──
export async function getRestaurantById(id) {
  const res = await fetch(`${API_URL}/restaurantes/${id}`);
  if (!res.ok) return null;

  const r = await res.json();

  return {
    id: r._id,
    name: r.nombre,
    cuisine: r.tipo_cocina,
    rating: r.calificacion_promedio,
    address: r.direccion,
    schedule: r.horario,
    phone: r.telefono,
    image: r.gridfs_imagen_id
      ? `${API_URL}/imagenes/restaurante/${r.gridfs_imagen_id}`
      : null,
  };
}

// ── Usado en: RestaurantDetails.jsx ──────────────────
// Trae el menú de artículos disponibles de un restaurante
export async function getMenuItemsByRestaurantId(restaurantId) {
  const res = await fetch(`${API_URL}/restaurantes/${restaurantId}/menu`);
  if (!res.ok) throw new Error("Error al cargar menú");

  const data = await res.json();

  return data.map((item) => ({
    id: item._id,
    restaurant_id: restaurantId,
    name: item.nombre,
    description: item.descripcion,
    price: item.precio,
    category: item.categoria,
    available: item.disponible,
    image_url: item.gridfs_imagen_id
      ? `${API_URL}/imagenes/articulo/${item.gridfs_imagen_id}`
      : null,
  }));
}