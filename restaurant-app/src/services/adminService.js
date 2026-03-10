// =====================================================
// Servicio: Administración (Frontend)
// Archivo: src/services/adminService.js
// =====================================================

const API_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Error en la petición");
  }

  return data;
}

// ── Usado en: CreateRestaurantPage ───────────────────
// Operación DB: insertOne
export function createRestaurant(payload) {
  return request("/admin/restaurantes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Usado en: UpdateReferencedDocsPage ───────────────
// Operación DB: updateOne + $set (reemplaza articulos_ids)
export function updateReferencedDocs(payload) {
  return request("/admin/restaurantes/update-referenced", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ── Usado en: UpdateOrderStatusPage ──────────────────
// Operación DB: updateOne + $set
export function updateOrderStatus(orderId, estado) {
  return request(`/admin/ordenes/${orderId}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
}

// ── Usado en: DeleteReviewPage ────────────────────────
// Operación DB: deleteOne
export function deleteReview(reviewId) {
  return request(`/admin/resenias/${reviewId}`, {
    method: "DELETE",
  });
}

// ── Usado en: CountRestaurantOrdersPage ──────────────
// Operación DB: countDocuments
export function countOrdersByRestaurant(restauranteId) {
  return request(`/admin/restaurantes/${restauranteId}/ordenes/count`);
}

// ── Usado en: PushItemPage ────────────────────────────
// Operación DB: updateOne + $push
export function pushItemToRestaurant(payload) {
  return request("/admin/restaurantes/push-item", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ── Usado en: RemoveArrayItemPage ─────────────────────
// Operación DB: updateOne + $pull
export function removeArrayItem(payload) {
  return request("/admin/restaurantes/remove-array-item", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ── Usado en: AddUniqueItemPage ───────────────────────
// Operación DB: updateOne + $addToSet
export function addUniqueItem(payload) {
  return request("/admin/restaurantes/add-unique-item", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}