const API_URL = "http://localhost:8000";

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

export function createRestaurant(payload) {
  return request("/admin/restaurantes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateReferencedDocs(payload) {
  return request("/admin/restaurantes/update-referenced", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateOrderStatus(orderId, estado) {
  return request(`/admin/ordenes/${orderId}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
}

export function deleteReview(reviewId) {
  return request(`/admin/resenias/${reviewId}`, {
    method: "DELETE",
  });
}

export function countOrdersByRestaurant(restauranteId) {
  return request(`/admin/restaurantes/${restauranteId}/ordenes/count`);
}

export function pushItemToRestaurant(payload) {
  return request("/admin/restaurantes/push-item", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function removeArrayItem(payload) {
  return request("/admin/restaurantes/remove-array-item", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function addUniqueItem(payload) {
  return request("/admin/restaurantes/add-unique-item", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}