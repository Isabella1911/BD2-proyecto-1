// Rutas: Restaurantes
// Base: /api/restaurantes

const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getMenuByRestaurantId,
  createRestaurant,
  addArticuloToRestaurant,
  removeArticuloFromRestaurant,
  addArticuloSinDuplicados,
} = require("../services/restaurantService");

// GET /api/restaurantes
// → Home.jsx: carga la lista de restaurantes
router.get("/", async (req, res) => {
  try {
    const data = await getAllRestaurants();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/restaurantes/:id
// → RestaurantDetails.jsx, RestaurantReviews.jsx
router.get("/:id", async (req, res) => {
  try {
    const data = await getRestaurantById(req.params.id);
    if (!data) return res.status(404).json({ error: "Restaurante no encontrado" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/restaurantes/:id/menu
// → RestaurantDetails.jsx: carga los artículos del menú
router.get("/:id/menu", async (req, res) => {
  try {
    const data = await getMenuByRestaurantId(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/restaurantes
// → Documentos Referenced: crea un restaurante nuevo
// Body: { nombre, direccion, telefono, tipo_cocina, horario }
router.post("/", async (req, res) => {
  try {
    const result = await createRestaurant(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/restaurantes/:id/articulos
// → Manejo de Arrays ($push): agrega un artículo al array del restaurante
// Body: { articulo_id }
router.post("/:id/articulos", async (req, res) => {
  try {
    const { articulo_id } = req.body;
    const result = await addArticuloToRestaurant(req.params.id, articulo_id);
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/restaurantes/:id/articulos/:articuloId
// → Manejo de Arrays ($pull): elimina un artículo del array
router.delete("/:id/articulos/:articuloId", async (req, res) => {
  try {
    const result = await removeArticuloFromRestaurant(
      req.params.id,
      req.params.articuloId
    );
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/restaurantes/:id/articulos/addset
// → Manejo de Arrays ($addToSet): agrega sin duplicados
// Body: { articulo_id }
router.post("/:id/articulos/addset", async (req, res) => {
  try {
    const { articulo_id } = req.body;
    const result = await addArticuloSinDuplicados(req.params.id, articulo_id);
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
