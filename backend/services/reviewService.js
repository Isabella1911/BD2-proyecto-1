// =====================================================
// Servicio: Reseñas
// Colección: resenias, usuarios, restaurantes (lookup)
// =====================================================

const { getDb } = require("../db");

// ── GET /api/resenias/restaurante/:id ─────────────────
// Consulta con Lookup: obtener reseñas de un restaurante CON datos del usuario
// + Paginación (Límite de Registros)
async function getReviewsByRestaurant(restaurantId, page = 1, limit = 25, sortType = "recent") {
  const db = getDb();

  const sortMap = {
    recent: { fecha: -1 },
    best: { calificacion_num: -1 },
    worst: { calificacion_num: 1 },
  };
  const sortStage = sortMap[sortType] || { fecha: -1 };
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { restaurante_id: restaurantId } },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "usuarios",
        localField: "usuario_id",
        foreignField: "_id",
        as: "usuario_info",
      },
    },
    { $unwind: { path: "$usuario_info", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        restaurante_id: 1,
        orden_id: 1,
        calificacion_num: 1,
        comentario: 1,
        fecha: 1,
        usuario_id: 1,
        usuario_nombre: "$usuario_info.nombre",
      },
    },
  ];

  const [reviews, total] = await Promise.all([
    db.collection("resenias").aggregate(pipeline).toArray(),
    db.collection("resenias").countDocuments({ restaurante_id: restaurantId }),
  ]);

  return { reviews, total, page, totalPages: Math.ceil(total / limit) };
}

// ── GET /api/resenias/usuario/:id ─────────────────────
// Reseñas escritas por un usuario — para History.jsx pestaña reseñas
// Hace lookup con restaurantes para traer el nombre
async function getReviewsByUser(userId) {
  const db = getDb();

  const pipeline = [
    { $match: { usuario_id: userId } },
    { $sort: { fecha: -1 } }, // índice: idx_resenias_usuario_fecha
    {
      $lookup: {
        from: "restaurantes",
        localField: "restaurante_id",
        foreignField: "_id",
        as: "restaurante_info",
      },
    },
    { $unwind: { path: "$restaurante_info", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        usuario_id: 1,
        restaurante_id: 1,
        restaurante_nombre: "$restaurante_info.nombre",
        orden_id: 1,
        calificacion_num: 1,
        comentario: 1,
        fecha: 1,
      },
    },
  ];

  return await db.collection("resenias").aggregate(pipeline).toArray();
}

// ── POST /api/resenias ────────────────────────────────
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
async function deleteReview(reviewId) {
  const db = getDb();
  return await db.collection("resenias").deleteOne({ _id: reviewId });
}

module.exports = {
  getReviewsByRestaurant,
  getReviewsByUser,
  createReview,
  deleteReview,
};