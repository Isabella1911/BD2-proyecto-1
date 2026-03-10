// =====================================================
// Rutas: Panel de Administración
// Base: /admin
// Servidor: server-admin.js (puerto 8000)
//
// Mapa de rutas ↔ adminService.js (frontend):
//   POST   /admin/restaurantes                       → createRestaurant()
//   PATCH  /admin/ordenes/:id/estado                 → updateOrderStatus()
//   DELETE /admin/resenias/:id                       → deleteReview()
//   GET    /admin/restaurantes/:id/ordenes/count     → countOrdersByRestaurant()
//   PATCH  /admin/restaurantes/push-item             → pushItemToRestaurant()
//   PATCH  /admin/restaurantes/remove-array-item     → removeArrayItem()
//   PATCH  /admin/restaurantes/add-unique-item       → addUniqueItem()
//   PATCH  /admin/restaurantes/update-referenced     → updateReferencedDocs()
// =====================================================

const express = require("express");
const router  = express.Router();

const {
  createRestaurant,
  addArticuloToRestaurant,
  removeArticuloFromRestaurant,
  addArticuloSinDuplicados,
} = require("../services/restaurantService");

const { updateOrderStatus } = require("../services/orderService");
const { deleteReview }      = require("../services/reviewService");
const { countOrdersByRestaurant } = require("../services/statsService");
const { getDb } = require("../db");


// ── POST /admin/restaurantes ──────────────────────────
// Página:      CreateRestaurantPage
// Operación:   insertOne
// Body: { nombre, direccion, telefono, tipo_cocina, horario, imagen_url? }
router.post("/restaurantes", async (req, res) => {
  try {
    const result = await createRestaurant(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── PATCH /admin/ordenes/:id/estado ───────────────────
// Página:      UpdateOrderStatusPage
// Operación:   updateOne + $set
// Body: { estado: "Pendiente" | "En Ruta" | "Entregado" | "Cancelado" }
router.patch("/ordenes/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({ message: "El campo 'estado' es requerido" });
    }

    const result = await updateOrderStatus(req.params.id, estado);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ── DELETE /admin/resenias/:id ────────────────────────
// Página:      DeleteReviewPage
// Operación:   deleteOne
router.delete("/resenias/:id", async (req, res) => {
  try {
    const result = await deleteReview(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── GET /admin/restaurantes/:id/ordenes/count ─────────
// Página:      CountRestaurantOrdersPage
// Operación:   countDocuments
// Responde:    { total: number }
router.get("/restaurantes/:id/ordenes/count", async (req, res) => {
  try {
    const data = await countOrdersByRestaurant(req.params.id);
    // statsService devuelve { restaurante_id, total_ordenes }
    // la página espera { total }
    res.json({ total: data.total_ordenes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── PATCH /admin/restaurantes/push-item ───────────────
// Página:      PushItemPage
// Operación:   updateOne + $push
// Body: { restaurante_id, articulo_id }
router.patch("/restaurantes/push-item", async (req, res) => {
  try {
    const { restaurante_id, articulo_id } = req.body;

    if (!restaurante_id || !articulo_id) {
      return res.status(400).json({ message: "Se requieren 'restaurante_id' y 'articulo_id'" });
    }

    const result = await addArticuloToRestaurant(restaurante_id, articulo_id);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── PATCH /admin/restaurantes/remove-array-item ───────
// Página:      RemoveArrayItemPage
// Operación:   updateOne + $pull
// Body: { restaurante_id, articulo_id }
router.patch("/restaurantes/remove-array-item", async (req, res) => {
  try {
    const { restaurante_id, articulo_id } = req.body;

    if (!restaurante_id || !articulo_id) {
      return res.status(400).json({ message: "Se requieren 'restaurante_id' y 'articulo_id'" });
    }

    const result = await removeArticuloFromRestaurant(restaurante_id, articulo_id);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── PATCH /admin/restaurantes/add-unique-item ─────────
// Página:      AddUniqueItemPage
// Operación:   updateOne + $addToSet
// Body: { restaurante_id, articulo_id }
router.patch("/restaurantes/add-unique-item", async (req, res) => {
  try {
    const { restaurante_id, articulo_id } = req.body;

    if (!restaurante_id || !articulo_id) {
      return res.status(400).json({ message: "Se requieren 'restaurante_id' y 'articulo_id'" });
    }

    const result = await addArticuloSinDuplicados(restaurante_id, articulo_id);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── PATCH /admin/restaurantes/update-referenced ───────
// Página:      UpdateReferencedDocsPage
// Operación:   updateOne + $set  (reemplaza el array articulos_ids completo)
// Body: { restaurante_id, articulos_ids: string[] }
router.patch("/restaurantes/update-referenced", async (req, res) => {
  try {
    const { restaurante_id, articulos_ids } = req.body;

    if (!restaurante_id || !Array.isArray(articulos_ids)) {
      return res.status(400).json({
        message: "Se requieren 'restaurante_id' y 'articulos_ids' (array)",
      });
    }

    const db = getDb();

    const result = await db.collection("restaurantes").updateOne(
      { _id: restaurante_id },
      { $set: { articulos_ids } }   // $set reemplaza el array de referencias
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;