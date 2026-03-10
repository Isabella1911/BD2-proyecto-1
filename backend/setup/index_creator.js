// =====================================================
// Proyecto 01 - MongoDB | Creación de Índices
// Índices definidos en el documento del proyecto
// Seguro de correr múltiples veces (usa nombres fijos)
// =====================================================

const { MongoClient } = require("mongodb");

require('dotenv').config({ path: '../../.env' });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// ── Definición de todos los índices ──────────────────
// Estructura: { coleccion, spec, opciones, descripcion }
const INDICES = [

  // ── Colección: ordenes ────────────────────────────

  {
    coleccion: "ordenes",
    spec: { usuario_id: 1, fecha_pedido: -1 },
    opciones: { name: "idx_ordenes_usuario_fecha" },
    descripcion: "Índice 1 · Historial de pedidos por usuario, ordenado por fecha descendente.",
  },
  {
    coleccion: "ordenes",
    spec: { restaurante_id: 1, estado: 1, fecha_pedido: -1 },
    opciones: { name: "idx_ordenes_restaurante_estado_fecha" },
    descripcion: "Índice 2 · Pedidos por restaurante y estado (gestión de entregas y reportes mensuales).",
  },

  // ── Índice MULTIKEY ───────────────────────────────
  // ordenes.items es un array de subdocumentos embebidos.
  // Al indexar un campo dentro de un array, MongoDB crea
  // automáticamente un índice Multikey — una entrada de
  // índice por cada elemento del array.
  // Uso: buscar todas las órdenes que contengan un platillo
  //      específico → { "items.nombre": "Pizza Pepperoni" }
  {
    coleccion: "ordenes",
    spec: { "items.nombre": 1 },
    opciones: { name: "idx_ordenes_items_nombre_multikey" },
    descripcion: "Multikey · Índice sobre array embebido items[].nombre — permite buscar órdenes por nombre de platillo.",
  },

  // ── Colección: resenias ───────────────────────────

  {
    coleccion: "resenias",
    spec: { restaurante_id: 1, fecha: -1 },
    opciones: { name: "idx_resenias_restaurante_fecha" },
    descripcion: "Índice 3a · Reseñas de un restaurante ordenadas por fecha (más recientes primero).",
  },
  {
    coleccion: "resenias",
    spec: { restaurante_id: 1, calificacion_num: -1 },
    opciones: { name: "idx_resenias_restaurante_calificacion" },
    descripcion: "Índice 3b · Reseñas de un restaurante ordenadas por calificación (mejores primero).",
  },
  {
    coleccion: "resenias",
    spec: { usuario_id: 1, fecha: -1 },
    opciones: { name: "idx_resenias_usuario_fecha" },
    descripcion: "Índice 5 · Historial de reseñas por usuario (perfil personal), ordenado por fecha.",
  },

  // ── Colección: articulos ──────────────────────────

  {
    coleccion: "articulos",
    spec: { restaurante_id: 1, disponible: 1, nombre: 1 },
    opciones: { name: "idx_articulos_restaurante_disponible_nombre" },
    descripcion: "Índice 4 · Menú de un restaurante filtrado por disponibilidad y ordenado por nombre.",
  },

  // ── Índice TEXT ───────────────────────────────────
  // Permite búsqueda full-text en nombre y descripción
  // de artículos. MongoDB tokeniza, normaliza y elimina
  // stopwords automáticamente.
  // Uso: db.articulos.find({ $text: { $search: "pizza" } })
  // Nota: solo puede existir UN índice text por colección.
  {
    coleccion: "articulos",
    spec: { nombre: "text", descripcion: "text" },
    opciones: {
      name: "idx_articulos_text_busqueda",
      weights: { nombre: 10, descripcion: 3 }, // nombre tiene mayor relevancia
      default_language: "spanish",
    },
    descripcion: "Text · Búsqueda full-text en nombre (peso 10) y descripción (peso 3) de artículos.",
  },

  // ── Colección: usuarios ───────────────────────────

  {
    coleccion: "usuarios",
    spec: { email: 1 },
    opciones: { name: "idx_usuarios_email", unique: true },
    descripcion: "Email único · Identificador de autenticación, garantiza unicidad.",
  },

  // ── Colección: restaurantes ───────────────────────

  {
    coleccion: "restaurantes",
    spec: { tipo_cocina: 1, calificacion_promedio: -1 },
    opciones: { name: "idx_restaurantes_cocina_calificacion" },
    descripcion: "Filtro por tipo de cocina ordenado por mejor calificación.",
  },
];

// ── Lógica de creación ────────────────────────────────
async function crearIndices(db) {
  const resultados = { creados: [], existentes: [], errores: [] };

  for (const idx of INDICES) {
    const col = db.collection(idx.coleccion);
    try {
      const nombre = await col.createIndex(idx.spec, idx.opciones);
      resultados.creados.push({ nombre, coleccion: idx.coleccion });
    } catch (err) {
      if (err.codeName === "IndexOptionsConflict" || err.codeName === "IndexKeySpecsConflict") {
        resultados.existentes.push({ nombre: idx.opciones.name, coleccion: idx.coleccion });
      } else {
        resultados.errores.push({ nombre: idx.opciones.name, coleccion: idx.coleccion, error: err.message });
      }
    }
  }

  return resultados;
}

// ── Reporte en consola ────────────────────────────────
function imprimirReporte(resultados) {
  console.log("\n══════════════════════════════════════════");
  console.log("  REPORTE DE ÍNDICES");
  console.log("══════════════════════════════════════════");

  if (resultados.creados.length) {
    console.log(`\n✅ Creados (${resultados.creados.length}):`);
    for (const r of resultados.creados) {
      console.log(`   [${r.coleccion}] ${r.nombre}`);
    }
  }

  if (resultados.existentes.length) {
    console.log(`\n⚠️  Ya existían (${resultados.existentes.length}):`);
    for (const r of resultados.existentes) {
      console.log(`   [${r.coleccion}] ${r.nombre}`);
    }
  }

  if (resultados.errores.length) {
    console.log(`\n❌ Errores (${resultados.errores.length}):`);
    for (const r of resultados.errores) {
      console.log(`   [${r.coleccion}] ${r.nombre} → ${r.error}`);
    }
  }

  console.log("\n══════════════════════════════════════════\n");
}

// ── Export (usado por index.js) ───────────────────────
module.exports = { crearIndices, imprimirReporte };

// ── Standalone (node index_creator.js) ───────────────
if (require.main === module) {
  const { MongoClient: MC } = require("mongodb");
  const client = new MC(URI);
  client.connect().then(async () => {
    console.log(`Conectado · DB: "${DB_NAME}"`);
    console.log(`Creando ${INDICES.length} índices...\n`);
    for (const idx of INDICES) {
      console.log(`   [${idx.coleccion}] ${idx.opciones.name}`);
      console.log(`   └─ ${idx.descripcion}\n`);
    }
    const res = await crearIndices(client.db(DB_NAME));
    imprimirReporte(res);
    client.close();
  }).catch(err => { console.error(err.message); process.exit(1); });
}