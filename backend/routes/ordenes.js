// Rutas: Órdenes
// Base: /api/ordenes

const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  updateItemQuantity,
  getDeliveredOrdersByRestaurant,
} = require("../services/orderService");

// POST /api/ordenes
// → Documentos Embedded: crea orden con items embebidos
// → CartContext / checkout
// Body: { usuario_id, restaurante_id, items[], monto_total, direccion_entrega, metodo_pago }
router.post("/", async (req, res) => {
  try {
    const result = await createOrder(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ordenes/usuario/:usuarioId
// → OrdersContext, History.jsx
router.get("/usuario/:usuarioId", async (req, res) => {
  try {
    const data = await getOrdersByUserId(req.params.usuarioId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ordenes/restaurante/:id/entregadas
// → Ordenamiento + Proyección + Paginación
// Query params: ?page=1&limit=10
router.get("/restaurante/:id/entregadas", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await getDeliveredOrdersByRestaurant(req.params.id, page, limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ordenes/:id
// → OrderDetail.jsx
router.get("/:id", async (req, res) => {
  try {
    const data = await getOrderById(req.params.id);
    if (!data) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/ordenes/:id/estado
// → Actualización de documento: cambia el estado de la orden
// Body: { estado: "En Ruta" | "Entregado" | "Cancelado" }
router.patch("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const result = await updateOrderStatus(req.params.id, estado);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/ordenes/:id/items/:articuloId/cantidad
// → Manejo de Embedded: actualiza cantidad de un item dentro de la orden
// Body: { cantidad: 3 }
router.patch("/:id/items/:articuloId/cantidad", async (req, res) => {
  try {
    const { cantidad } = req.body;
    const result = await updateItemQuantity(
      req.params.id,
      req.params.articuloId,
      cantidad
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Orden o artículo no encontrado" });
    }
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
