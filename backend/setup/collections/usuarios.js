// =====================================================
// Colección: usuarios
// =====================================================

async function setupUsuarios(db) {
  console.log("\n📦 Configurando colección: usuarios...");

  await db.createCollection("usuarios", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nombre", "email"],
        properties: {
          _id: { bsonType: "string" },
          nombre: {
            bsonType: "string",
            description: "Nombre completo del usuario",
          },
          email: {
            bsonType: "string",
            pattern: "^.+@.+\\..+$",
            description: "Correo electrónico único (usado para autenticación)",
          },
          direccion: {
            bsonType: "string",
            description: "Dirección de entrega predeterminada",
          },
          telefono: {
            bsonType: "string",
            description: "Teléfono de contacto",
          },
          fecha_registro: {
            bsonType: "date",
            description: "Fecha de creación de la cuenta",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  }).catch((err) => {
    if (err.codeName === "NamespaceExists") {
      console.log("  ⚠️  La colección usuarios ya existe, se omite creación.");
    } else {
      throw err;
    }
  });

  const col = db.collection("usuarios");

  // El email actúa como identificador único
  await col.createIndex(
    { email: 1 },
    { name: "idx_email_unique", unique: true }
  );

  console.log("  ✅ Colección usuarios configurada.");
  console.log("  📑 Índices creados: idx_email_unique");
}

module.exports = setupUsuarios;