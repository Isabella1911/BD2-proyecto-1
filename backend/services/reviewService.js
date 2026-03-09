// Servicio: Reseñas
// Colección: resenias, usuarios (lookup)

const { getDb } = require("../db");

// ── GET /api/resenias/restaurante/:id ─────────────────
// Consulta con Lookup: obtener reseñas de un restaurante CON datos del usuario
// + Paginación (Límite de Registros)
// Usada en: RestaurantReviews.jsx → getReviewsByRestaurantId()
async function getReviewsByRestaurant(restaurantId, page = 1, limit = 25, sortType = "recent") {
  const db = getDb();

  // Ordenamiento según sortType del frontend
  const sortMap = {
    recent: { fecha: -1 },  // índice: idx_resenias_restaurante_fecha
    best: { calificacion_num: -1 }, // índice: idx_resenias_restaurante_calificacion
    worst: { calificacion_num: 1 },
  };
  const sortStage = sortMap[sortType] || { fecha: -1 };

  const skip = (page - 1) * limit;

  // Pipeline de agregación: join con usuarios para traer el nombre
  const pipeline = [
    { $match: { restaurante_id: restaurantId } },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },
    // Lookup (Referenced): une con la colección de usuarios
    {
      $lookup: {
        from: "usuarios",
        localField: "usuario_id",
        foreignField: "_id",
        as: "usuario_info",
      },
    },
    { $unwind: { path: "$usuario_info", preserveNullAndEmptyArrays: true } },
    // Proyección: solo los campos que necesita el frontend
    {
      $project: {
        _id: 1,
        restaurante_id: 1,
        orden_id: 1,
        calificacion_num: 1,
        comentario: 1,
        fecha: 1,
        usuario_id: 1,
        usuario_nombre: "$usuario_info.nombre", // dato del usuario
      },
    },
  ];

  const [reviews, total] = await Promise.all([
    db.collection("resenias").aggregate(pipeline).toArray(),
    db.collection("resenias").countDocuments({ restaurante_id: restaurantId }),
  ]);

  return {
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ── POST /api/resenias ────────────────────────────────
// Creación de reseña
// Usada en: ReviewModal.jsx → createReview()
async function createReview(data) {
  const db = getDb();

  const newReview = {
    _id: `rev_${Date.now()}`,
    usuario_id: data.usuario_id,
    restaurante_id: data.restaurante_id,
    orden_id: data.orden_id || null,
    calificacion_num: data.calificacion_num,
    comentario: data.comentario,
    fecha: new Date(),
  };

  const result = await db.collection("resenias").insertOne(newReview);
  return { insertedId: result.insertedId, ...newReview };
}

// ── DELETE /api/resenias/:id ──────────────────────────
// Eliminación: eliminar una reseña específica
// Usada en: perfil de usuario / admin
async function deleteReview(reviewId) {
  const db = getDb();

  const result = await db
    .collection("resenias")
    .deleteOne({ _id: reviewId });

  return result;
}

module.exports = {
  getReviewsByRestaurant,
  createReview,
  deleteReview,
};
