// =====================================================
// Colección: restaurantes
// =====================================================

async function setupRestaurantes(db) {
  console.log("\n📦 Configurando colección: restaurantes...");

  // Crear colección con validación de esquema
  await db.createCollection("restaurantes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nombre", "direccion", "telefono", "tipo_cocina", "horario"],
        properties: {
          _id: { bsonType: "string" },
          nombre: {
            bsonType: "string",
            description: "Nombre comercial del restaurante",
          },
          direccion: {
            bsonType: "string",
            description: "Ubicación física del restaurante",
          },
          telefono: {
            bsonType: "string",
            description: "Teléfono de contacto",
          },
          tipo_cocina: {
            bsonType: "string",
            description: "Categoría gastronómica",
          },
          horario: {
            bsonType: "string",
            description: "Horario de atención",
          },
          calificacion_promedio: {
            bsonType: "double",
            minimum: 0,
            maximum: 5,
            description: "Promedio de calificaciones (actualizable)",
          },
          articulos_ids: {
            bsonType: "array",
            description: "Lista de IDs de los artículos (platos)",
            items: { bsonType: "string" },
          },
          fecha_registro: {
            bsonType: "date",
            description: "Fecha de alta en el sistema",
          },
          imagen_url: {
            bsonType: "string",
            description: "Imagen URL de la marca del restaurante",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  }).catch((err) => {
    // Si la colección ya existe, continuar
    if (err.codeName === "NamespaceExists") {
      console.log("  ⚠️  La colección restaurantes ya existe, se omite creación.");
    } else {
      throw err;
    }
  });

  const col = db.collection("restaurantes");

  // Índices
  await col.createIndex(
    { tipo_cocina: 1, calificacion_promedio: -1 },
    { name: "idx_cocina_calificacion" }
  );
  await col.createIndex(
    { nombre: 1 },
    { name: "idx_nombre", unique: false }
  );

  console.log("  ✅ Colección restaurantes configurada.");
  console.log("  📑 Índices creados: idx_cocina_calificacion, idx_nombre");
}

module.exports = setupRestaurantes;