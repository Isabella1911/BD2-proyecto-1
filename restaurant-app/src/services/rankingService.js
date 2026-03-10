// =====================================================
// Servicio: Rankings (Frontend)
// Reemplaza: src/services/rankingService.js
// Rankings.jsx importa getRankingData() desde aquí
// =====================================================

import { API_URL } from "./api";

// Llama a los dos endpoints de stats en paralelo
// y devuelve el formato que ya espera Rankings.jsx
export async function getRankingData() {
  const [restaurantesRes, platillosRes] = await Promise.all([
    fetch(`${API_URL}/stats/restaurantes-top?limit=4`),
    fetch(`${API_URL}/stats/platillos-top?limit=5`),
  ]);

  if (!restaurantesRes.ok) throw new Error("Error al cargar top restaurantes");
  if (!platillosRes.ok) throw new Error("Error al cargar top platillos");

  const restaurantes = await restaurantesRes.json();
  const platillos = await platillosRes.json();

  return {
    topRestaurants: restaurantes.map((r) => ({
      id: r._id,
      name: r.nombre,
      value: r.calificacion_promedio,
      extra: `${r.total_resenias} reseñas`,
      badge: "⭐",
    })),
    topDishes: platillos.map((d) => ({
      id: d.articulo_id,
      name: d.nombre,
      value: d.total_vendidos,
      extra: "vendidos",
      badge: "🍽️",
    })),
  };
}