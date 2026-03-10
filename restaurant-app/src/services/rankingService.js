// =====================================================
// Servicio: Rankings (Frontend)
// Archivo: src/services/rankingService.js
// =====================================================

import { API_URL } from "./api";

export async function getRankingData() {
  const [restaurantesRes, platillosRes] = await Promise.all([
    fetch(`${API_URL}/stats/restaurantes-top?limit=4`),
    fetch(`${API_URL}/stats/platillos-top?limit=5`),
  ]);

  if (!restaurantesRes.ok) throw new Error("Error al cargar top restaurantes");
  if (!platillosRes.ok) throw new Error("Error al cargar top platillos");

  const restaurantes = await restaurantesRes.json();
  const platillos    = await platillosRes.json();

  // Pipeline 3: ventas mensuales del restaurante #1 del top
  let ventasMensuales = [];
  let restauranteNombre = "";
  if (restaurantes.length > 0) {
    const topId = restaurantes[0]._id;
    restauranteNombre = restaurantes[0].nombre;
    const ventasRes = await fetch(`${API_URL}/stats/restaurante/${topId}/ventas-mensuales`);
    if (ventasRes.ok) {
      ventasMensuales = await ventasRes.json();
    }
  }

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
    ventasMensuales,
    restauranteNombre,
  };
}

