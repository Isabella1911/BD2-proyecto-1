// =====================================================
// Colección: articulos
// =====================================================

async function setupArticulos(db) {
  console.log("\n📦 Configurando colección: articulos...");

  await db.createCollection("articulos", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["restaurante_id", "nombre", "precio", "categoria"],
        properties: {
          _id: { bsonType: "string" },
          restaurante_id: {
            bsonType: "string",
            description: "ID del restaurante al que pertenece",
          },
          nombre: {
            bsonType: "string",
            description: "Nombre del platillo",
          },
          descripcion: {
            bsonType: "string",
            description: "Descripción del platillo",
          },
          precio: {
            bsonType: "double",
            minimum: 0,
            description: "Precio del platillo",
          },
          categoria: {
            bsonType: "string",
            description: "Tipo de gastronomía",
          },
          disponible: {
            bsonType: "bool",
            description: "Indica si está disponible para pedido",
          },
          imagen_url: {
            bsonType: "string",
            description: "URL de la imagen del platillo",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  }).catch((err) => {
    if (err.codeName === "NamespaceExists") {
      console.log("  ⚠️  La colección articulos ya existe, se omite creación.");
    } else {
      throw err;
    }
  });

  const col = db.collection("articulos");

  // Índice 4 del documento: restaurante + disponible + nombre (cubre menú filtrado y ordenado)
  await col.createIndex(
    { restaurante_id: 1, disponible: 1, nombre: 1 },
    { name: "idx_restaurante_disponible_nombre" }
  );

  console.log("  ✅ Colección articulos configurada.");
  console.log("  📑 Índices creados: idx_restaurante_disponible_nombre");
}

module.exports = setupArticulos;