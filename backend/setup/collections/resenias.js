// =====================================================
// Colección: resenias
// restaurante_id: siempre presente
// orden_id: opcional (puede ser null o no estar)
// =====================================================

async function setupResenias(db) {
  console.log("\n📦 Configurando colección: resenias...");

  await db.createCollection("resenias", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["usuario_id", "restaurante_id", "calificacion_num", "fecha"],
        properties: {
          _id: { bsonType: "string" },
          usuario_id: {
            bsonType: "string",
            description: "ID del usuario que escribió la reseña",
          },
          restaurante_id: {
            bsonType: "string",
            description: "ID del restaurante al que se refiere la reseña",
          },
          // orden_id es opcional: reseñas generales no están vinculadas a una orden
          orden_id: {
            bsonType: ["string", "null"],
            description: "ID de la orden (opcional)",
          },
          calificacion_num: {
            bsonType: "int",
            minimum: 1,
            maximum: 5,
            description: "Calificación numérica del 1 al 5",
          },
          comentario: {
            bsonType: "string",
            description: "Texto de la reseña",
          },
          fecha: {
            bsonType: "date",
            description: "Fecha y hora de publicación",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  }).catch((err) => {
    if (err.codeName === "NamespaceExists") {
      console.log("  ⚠️  La colección resenias ya existe, se omite creación.");
    } else {
      throw err;
    }
  });

  const col = db.collection("resenias");

  // Índice 3a: reseñas de un restaurante por fecha (más recientes primero)
  await col.createIndex(
    { restaurante_id: 1, fecha: -1 },
    { name: "idx_restaurante_fecha" }
  );

  // Índice 3b: reseñas de un restaurante por calificación (mejores primero)
  await col.createIndex(
    { restaurante_id: 1, calificacion_num: -1 },
    { name: "idx_restaurante_calificacion" }
  );

  // Índice 5: historial de reseñas del usuario (perfil personal)
  await col.createIndex(
    { usuario_id: 1, fecha: -1 },
    { name: "idx_usuario_fecha" }
  );

  console.log("  ✅ Colección resenias configurada.");
  console.log(
    "  📑 Índices creados: idx_restaurante_fecha, idx_restaurante_calificacion, idx_usuario_fecha"
  );
}

module.exports = setupResenias;