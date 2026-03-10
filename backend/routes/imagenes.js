// =====================================================
// Rutas: Imágenes (GridFS)
// Base: /api/imagenes
// =====================================================

const express = require("express");
const router = express.Router();
const {
  getRestaurantImageStream,
  getArticuloImageStream,
} = require("../services/imageService");

// GET /api/imagenes/restaurante/:fileId
// → Sirve la imagen de un restaurante desde GridFS
// → Usado en: restaurantService.js del frontend (image field)
router.get("/restaurante/:fileId", async (req, res) => {
  try {
    const result = await getRestaurantImageStream(req.params.fileId);

    if (!result) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    res.set("Content-Type", result.contentType);
    res.set("Cache-Control", "public, max-age=86400"); // cache 1 día
    result.stream.pipe(res);

    result.stream.on("error", () => {
      res.status(500).json({ error: "Error al leer imagen" });
    });
  } catch (err) {
    // ObjectId inválido
    res.status(400).json({ error: "ID de imagen inválido" });
  }
});

// GET /api/imagenes/articulo/:fileId
// → Sirve la imagen de un artículo del menú desde GridFS
// → Usado en: restaurantService.js del frontend (image_url field)
router.get("/articulo/:fileId", async (req, res) => {
  try {
    const result = await getArticuloImageStream(req.params.fileId);

    if (!result) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    res.set("Content-Type", result.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    result.stream.pipe(res);

    result.stream.on("error", () => {
      res.status(500).json({ error: "Error al leer imagen" });
    });
  } catch (err) {
    res.status(400).json({ error: "ID de imagen inválido" });
  }
});

module.exports = router;