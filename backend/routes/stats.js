// Rutas: Estadísticas / Agregaciones
// Base: /api/stats

const express = require("express");
const router = express.Router();
const {
  countOrdersByRestaurant,
  getMonthlySalesSummary,
  getTopDishes,
  getTopRestaurants,
} = require("../services/statsService");

// GET /api/stats/restaurante/:id/total-ordenes
// → Agregación Simple: cuántas órdenes tiene un restaurante
// → RestaurantInfo.jsx
router.get("/restaurante/:id/total-ordenes", async (req, res) => {
  try {
    const data = await countOrdersByRestaurant(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/restaurante/:id/ventas-mensuales
// → Agregación Compleja 1: resumen de ventas agrupadas por mes
// → panel de estadísticas del restaurante
router.get("/restaurante/:id/ventas-mensuales", async (req, res) => {
  try {
    const data = await getMonthlySalesSummary(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/platillos-top
// → Agregación Compleja 2: platillos más vendidos (unwind de items embebidos)
// → Ranking.jsx → topDishes
// Query params: ?limit=5
router.get("/platillos-top", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await getTopDishes(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/restaurantes-top
// → Agregación Compleja 3: top restaurantes por calificación con lookup de reseñas
// → Ranking.jsx → topRestaurants
// Query params: ?limit=5
router.get("/restaurantes-top", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await getTopRestaurants(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
