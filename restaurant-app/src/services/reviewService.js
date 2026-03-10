// =====================================================
// Servicio: Reseñas (Frontend)
// Nuevo archivo: src/services/reviewService.js
// =====================================================

import { API_URL } from "./api";

// ── Usado en: RestaurantReviews.jsx ───────────────────
// Reseñas de un restaurante con datos del usuario, paginadas
// sort: "recent" | "best" | "worst"
export async function getReviewsByRestaurantId(restaurantId, page = 1, limit = 25, sort = "recent") {
  const params = new URLSearchParams({ page, limit, sort });
  const res = await fetch(`${API_URL}/resenias/restaurante/${restaurantId}?${params}`);
  if (!res.ok) throw new Error("Error al cargar reseñas");

  const data = await res.json();

  return {
    reviews: data.reviews.map((r) => ({
      id: r._id,
      usuario_id: r.usuario_id,
      usuario_nombre: r.usuario_nombre,
      restaurante_id: r.restaurante_id,
      orden_id: r.orden_id,
      calificacion_num: r.calificacion_num,
      comentario: r.comentario,
      fecha: r.fecha,
    })),
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
  };
}

// ── Usado en: ReviewModal.jsx → ReviewsContext ────────
export async function createReview(reviewData) {
  const res = await fetch(`${API_URL}/resenias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) throw new Error("Error al crear reseña");
  return await res.json();
}

// ── Usado en: perfil de usuario ───────────────────────
export async function deleteReview(reviewId) {
  const res = await fetch(`${API_URL}/resenias/${reviewId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar reseña");
  return await res.json();
}