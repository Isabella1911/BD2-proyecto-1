// Servicio: Restaurantes
// Colección: restaurantes, articulos

const { getDb } = require("../db");

// ── GET /api/restaurantes ─────────────────────────────
// Usada en: Home.jsx → getRestaurants()
// Devuelve todos los restaurantes (nombre, cocina, calificacion, imagen, direccion)
async function getAllRestaurants() {
  const db = getDb();

  return await db
    .collection("restaurantes")
    .find(
      {},
      {
        projection: {
          _id: 1,
          nombre: 1,
          tipo_cocina: 1,
          calificacion_promedio: 1,
          direccion: 1,
          horario: 1,
          gridfs_imagen_id: 1,
        },
      }
    )
    .toArray();
}

// ── GET /api/restaurantes/:id ─────────────────────────
// Usada en: RestaurantDetails.jsx, RestaurantReviews.jsx → getRestaurantById()
async function getRestaurantById(id) {
  const db = getDb();

  return await db.collection("restaurantes").findOne(
    { _id: id },
    {
      projection: {
        _id: 1,
        nombre: 1,
        tipo_cocina: 1,
        calificacion_promedio: 1,
        direccion: 1,
        horario: 1,
        telefono: 1,
        gridfs_imagen_id: 1,
        articulos_ids: 1,
      },
    }
  );
}

// ── GET /api/restaurantes/:id/menu ────────────────────
// Usada en: RestaurantDetails.jsx → getMenuItemsByRestaurantId()
// Devuelve artículos disponibles de un restaurante
async function getMenuByRestaurantId(restaurantId) {
  const db = getDb();

  return await db
    .collection("articulos")
    .find(
      { restaurante_id: restaurantId, disponible: true },
      {
        projection: {
          _id: 1,
          nombre: 1,
          descripcion: 1,
          precio: 1,
          categoria: 1,
          disponible: 1,
          gridfs_imagen_id: 1,
        },
      }
    )
    .sort({ nombre: 1 }) // Índice: idx_articulos_restaurante_disponible_nombre
    .toArray();
}

// ── POST /api/restaurantes ────────────────────────────
// Documentos Referenced: crea un restaurante (articulos_ids como array de referencias)
async function createRestaurant(data) {
  const db = getDb();

  const newRestaurant = {
    _id: `rest_${Date.now()}`,
    nombre: data.nombre,
    direccion: data.direccion,
    telefono: data.telefono,
    tipo_cocina: data.tipo_cocina,
    horario: data.horario,
    calificacion_promedio: 0.0,
    articulos_ids: [], // referencias (documentos referenced)
    fecha_registro: new Date(),
    gridfs_imagen_id: null,
  };

  const result = await db.collection("restaurantes").insertOne(newRestaurant);
  return { insertedId: result.insertedId, ...newRestaurant };
}

// ── POST /api/restaurantes/:id/articulos ──────────────
// Manejo de Arrays ($push): agregar un artículo al restaurante
async function addArticuloToRestaurant(restaurantId, articuloId) {
  const db = getDb();

  const result = await db.collection("restaurantes").updateOne(
    { _id: restaurantId },
    { $push: { articulos_ids: articuloId } } // $push simple
  );

  return result;
}

// ── DELETE /api/restaurantes/:id/articulos/:articuloId ─
// Manejo de Arrays ($pull): eliminar un artículo del array
async function removeArticuloFromRestaurant(restaurantId, articuloId) {
  const db = getDb();

  const result = await db.collection("restaurantes").updateOne(
    { _id: restaurantId },
    { $pull: { articulos_ids: articuloId } } // $pull elimina por valor
  );

  return result;
}

// ── POST /api/restaurantes/:id/articulos/addset ───────
// Manejo de Arrays ($addToSet): agregar artículo sin duplicados
async function addArticuloSinDuplicados(restaurantId, articuloId) {
  const db = getDb();

  const result = await db.collection("restaurantes").updateOne(
    { _id: restaurantId },
    { $addToSet: { articulos_ids: articuloId } } // $addToSet evita duplicados
  );

  return result;
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getMenuByRestaurantId,
  createRestaurant,
  addArticuloToRestaurant,
  removeArticuloFromRestaurant,
  addArticuloSinDuplicados,
};
