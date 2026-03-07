// =====================================================
// Colección: ordenes
// Los artículos se guardan como subdocumentos embebidos
// para mantener snapshot histórico fiel.
// =====================================================

async function setupOrdenes(db) {
  console.log("\n📦 Configurando colección: ordenes...");

  await db.createCollection("ordenes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "usuario_id",
          "restaurante_id",
          "fecha_pedido",
          "estado",
          "monto_total",
          "items",
        ],
        properties: {
          _id: { bsonType: "string" },
          usuario_id: {
            bsonType: "string",
            description: "ID del usuario que realizó el pedido",
          },
          restaurante_id: {
            bsonType: "string",
            description: "ID del restaurante",
          },
          fecha_pedido: {
            bsonType: "date",
            description: "Fecha y hora del pedido",
          },
          estado: {
            bsonType: "string",
            enum: ["Pendiente", "En Ruta", "Entregado", "Cancelado"],
            description: "Estado actual de la orden",
          },
          monto_total: {
            bsonType: "double",
            minimum: 0,
            description: "Total de la orden",
          },
          // Embedding: snapshot de artículos al momento de la compra
          items: {
            bsonType: "array",
            minItems: 1,
            description: "Artículos de la orden (embebidos con snapshot histórico)",
            items: {
              bsonType: "object",
              required: ["articulo_id", "nombre", "precio_unitario", "cantidad", "subtotal"],
              properties: {
                articulo_id: { bsonType: "string" },
                nombre: { bsonType: "string" },
                precio_unitario: { bsonType: "double", minimum: 0 },
                cantidad: { bsonType: "int", minimum: 1 },
                subtotal: { bsonType: "double", minimum: 0 },
              },
            },
          },
          direccion_entrega: {
            bsonType: "string",
            description: "Dirección de entrega específica para esta orden",
          },
          metodo_pago: {
            bsonType: "string",
            description: "Método de pago utilizado",
          },
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  }).catch((err) => {
    if (err.codeName === "NamespaceExists") {
      console.log("  ⚠️  La colección ordenes ya existe, se omite creación.");
    } else {
      throw err;
    }
  });

  const col = db.collection("ordenes");

  // Índice 1: historial de pedidos por usuario ordenado por fecha desc
  await col.createIndex(
    { usuario_id: 1, fecha_pedido: -1 },
    { name: "idx_usuario_fecha" }
  );

  // Índice 2: pedidos por restaurante + estado + fecha (gestión de entregas y reportes)
  await col.createIndex(
    { restaurante_id: 1, estado: 1, fecha_pedido: -1 },
    { name: "idx_restaurante_estado_fecha" }
  );

  console.log("  ✅ Colección ordenes configurada.");
  console.log("  📑 Índices creados: idx_usuario_fecha, idx_restaurante_estado_fecha");
}

module.exports = setupOrdenes;