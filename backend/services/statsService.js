// Servicio: Agregaciones
// Colecciones: ordenes, resenias, restaurantes, articulos

const { getDb } = require("../db");

// ── GET /api/stats/restaurante/:id/total-ordenes ──────
// Agregación Simple: contar cuántas órdenes tiene un restaurante
// Usada en: panel del restaurante / RestaurantInfo
async function countOrdersByRestaurant(restaurantId) {
  const db = getDb();

  const result = await db.collection("ordenes").countDocuments({
    restaurante_id: restaurantId,
  });

  return { restaurante_id: restaurantId, total_ordenes: result };
}

// ── GET /api/stats/restaurante/:id/resumen ────────────
// Agregación Compleja 1: resumen mensual de ventas por restaurante
// Pipeline: match → group por mes → sort → project
// Usada en: panel estadísticas / Ranking.jsx
async function getMonthlySalesSummary(restaurantId) {
  const db = getDb();

  const pipeline = [
    {
      $match: {
        restaurante_id: restaurantId,
        estado: "Entregado",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$fecha_pedido" },
          month: { $month: "$fecha_pedido" },
        },
        total_ventas: { $sum: "$monto_total" },
        total_ordenes: { $sum: 1 },
        promedio_orden: { $avg: "$monto_total" },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $project: {
        _id: 0,
        año: "$_id.year",
        mes: "$_id.month",
        total_ventas: { $round: ["$total_ventas", 2] },
        total_ordenes: 1,
        promedio_orden: { $round: ["$promedio_orden", 2] },
      },
    },
  ];

  return await db.collection("ordenes").aggregate(pipeline).toArray();
}

// ── GET /api/stats/platillos-mas-vendidos ─────────────
// Agregación Compleja 2: top platillos más vendidos (global)
// Pipeline: unwind items → group por articulo → sort → limit → lookup nombre
// Usada en: Ranking.jsx → topDishes
async function getTopDishes(limit = 5) {
  const db = getDb();

  const pipeline = [
    { $match: { estado: "Entregado" } },
    // Descomponer el array de items embebidos
    { $unwind: "$items" },
    // Agrupar por artículo y sumar cantidades vendidas
    {
      $group: {
        _id: "$items.articulo_id",
        nombre: { $first: "$items.nombre" }, // snapshot del nombre
        total_vendidos: { $sum: "$items.cantidad" },
        total_ingresos: { $sum: "$items.subtotal" },
      },
    },
    { $sort: { total_vendidos: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        articulo_id: "$_id",
        nombre: 1,
        total_vendidos: 1,
        total_ingresos: { $round: ["$total_ingresos", 2] },
      },
    },
  ];

  return await db.collection("ordenes").aggregate(pipeline).toArray();
}

// ── GET /api/stats/restaurantes-top ───────────────────
// Agregación Compleja 3: top restaurantes por calificación promedio
// con conteo de reseñas y total de órdenes entregadas
// Pipeline: lookup reseñas → addFields promedio → lookup ordenes → sort → limit
// Usada en: Ranking.jsx → topRestaurants
async function getTopRestaurants(limit = 5) {
  const db = getDb();

  const pipeline = [
    // Obtener reseñas de cada restaurante
    {
      $lookup: {
        from: "resenias",
        localField: "_id",
        foreignField: "restaurante_id",
        as: "resenias",
      },
    },
    // Calcular promedio y conteo de reseñas
    {
      $addFields: {
        promedio_calculado: { $avg: "$resenias.calificacion_num" },
        total_resenias: { $size: "$resenias" },
      },
    },
    // Solo restaurantes con al menos una reseña
    { $match: { total_resenias: { $gt: 0 } } },
    { $sort: { promedio_calculado: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        nombre: 1,
        tipo_cocina: 1,
        calificacion_promedio: { $round: ["$promedio_calculado", 1] },
        total_resenias: 1,
        gridfs_imagen_id: 1,
      },
    },
  ];

  return await db.collection("restaurantes").aggregate(pipeline).toArray();
}

module.exports = {
  countOrdersByRestaurant,
  getMonthlySalesSummary,
  getTopDishes,
  getTopRestaurants,
};
