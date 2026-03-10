// =====================================================
// Servicio: GridFS - Servir imágenes
// Colecciones: restaurante_imagenes, articulo_imagenes
// =====================================================

const { GridFSBucket, ObjectId } = require("mongodb");
const { getDb } = require("../db");

// ── Busca y devuelve el stream de una imagen de restaurante ──
async function getRestaurantImageStream(fileId) {
  const db = getDb();
  const bucket = new GridFSBucket(db, { bucketName: "restaurante_imagenes" });

  const id = new ObjectId(fileId);

  // Verifica que el archivo exista antes de streamear
  const files = await bucket.find({ _id: id }).toArray();
  if (!files.length) return null;

  return {
    stream: bucket.openDownloadStream(id),
    contentType: files[0].metadata?.contentType || "image/jpeg",
    filename: files[0].filename,
  };
}

// ── Busca y devuelve el stream de una imagen de artículo ──
async function getArticuloImageStream(fileId) {
  const db = getDb();
  const bucket = new GridFSBucket(db, { bucketName: "articulo_imagenes" });

  const id = new ObjectId(fileId);

  const files = await bucket.find({ _id: id }).toArray();
  if (!files.length) return null;

  return {
    stream: bucket.openDownloadStream(id),
    contentType: files[0].metadata?.contentType || "image/jpeg",
    filename: files[0].filename,
  };
}

module.exports = { getRestaurantImageStream, getArticuloImageStream };