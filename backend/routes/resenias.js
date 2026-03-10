// =====================================================
// Rutas: Reseñas
// Base: /api/resenias
// =====================================================

const express = require("express");
const router = express.Router();
const {
  getReviewsByRestaurant,
  getReviewsByUser,
  createReview,
  deleteReview,
} = require("../services/reviewService");

// GET /api/resenias/restaurante/:id
// → RestaurantReviews.jsx: reseñas paginadas con datos del usuario
// Query params: ?page=1&limit=25&sort=recent|best|worst
router.get("/restaurante/:id", async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 25;
    const sort  = req.query.sort || "recent";
    const data  = await getReviewsByRestaurant(req.params.id, page, limit, sort);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resenias/usuario/:id
// → History.jsx pestaña "Reseñas": reseñas del usuario con nombre del restaurante
router.get("/usuario/:id", async (req, res) => {
  try {
    const data = await getReviewsByUser(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resenias
// → ReviewModal.jsx
// Body: { usuario_id, restaurante_id, orden_id, calificacion_num, comentario }
router.post("/", async (req, res) => {
  try {
    const result = await createReview(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/resenias/:id
// → Eliminar una reseña específica
router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteReview(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;