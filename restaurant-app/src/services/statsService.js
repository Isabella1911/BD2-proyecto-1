// =====================================================
// Servicio: Estadísticas (Frontend)
// Nuevo archivo: src/services/statsService.js
// =====================================================

import { API_URL } from "./api";

// ── Usado en: RestaurantInfo.jsx ──────────────────────
// Agregación simple: total de órdenes de un restaurante
export async function getOrderCountByRestaurant(restaurantId) {
  const res = await fetch(`${API_URL}/stats/restaurante/${restaurantId}/total-ordenes`);
  if (!res.ok) throw new Error("Error al cargar total de órdenes");
  return await res.json(); // { restaurante_id, total_ordenes }
}

// ── Usado en: Ranking.jsx → topRestaurants ────────────
// Agregación compleja 3: top restaurantes por calificación
export async function getTopRestaurants(limit = 4) {
  const res = await fetch(`${API_URL}/stats/restaurantes-top?limit=${limit}`);
  if (!res.ok) throw new Error("Error al cargar top restaurantes");

  const data = await res.json();

  // Mapea al formato que usa RankingCard
  return data.map((r, index) => ({
    id: r._id,
    name: r.nombre,
    value: r.calificacion_promedio,
    extra: `${r.total_resenias} reseñas`,
    badge: "⭐",
  }));
}

// ── Usado en: Ranking.jsx → topDishes ─────────────────
// Agregación compleja 2: platillos más vendidos
export async function getTopDishes(limit = 5) {
  const res = await fetch(`${API_URL}/stats/platillos-top?limit=${limit}`);
  if (!res.ok) throw new Error("Error al cargar top platillos");

  const data = await res.json();

  return data.map((d) => ({
    id: d.articulo_id,
    name: d.nombre,
    value: d.total_vendidos,
    extra: "vendidos este mes",
    badge: "🍽️",
  }));
}