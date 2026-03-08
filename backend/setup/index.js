// =====================================================
// Proyecto 01 - MongoDB | Setup Unificado
// Ejecuta todo en orden:
//   1. Crear colecciones (schema validation)
//   2. Insertar mock data        → data_injection.js
//   3. Crear índices             → index_creator.js
//   4. Subir imágenes a GridFS  → gridfs.js
// =====================================================

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

require('dotenv').config({ path: '../../.env' });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// ── Imports ───────────────────────────────────────────
const setupRestaurantes = require("./collections/restaurantes");
const setupUsuarios     = require("./collections/usuarios");
const setupArticulos    = require("./collections/articulos");
const setupOrdenes      = require("./collections/ordenes");
const setupResenias     = require("./collections/resenias");

const { seedAll }       = require("./data_injection");
const { crearIndices }  = require("./index_creator");
const { subirImagenes } = require("./gridfs");

// ── Utilidad: encabezado de paso ──────────────────────
function paso(num, titulo) {
  console.log(`\n${"═".repeat(52)}`);
  console.log(`  PASO ${num} — ${titulo}`);
  console.log(`${"═".repeat(52)}`);
}

// ── Main ──────────────────────────────────────────────
async function main() {
  const inicio = Date.now();
  const client = new MongoClient(URI);

  try {
    await client.connect();
    console.log(`\n Conectado a MongoDB · DB: "${DB_NAME}"`);

    const db = client.db(DB_NAME);

    // 1 ── Colecciones ─────────────────────────────────
    paso(1, "Creando colecciones con validación de esquema");
    await setupRestaurantes(db);
    await setupUsuarios(db);
    await setupArticulos(db);
    await setupOrdenes(db);
    await setupResenias(db);
    console.log("\n  Todas las colecciones listas.");

    // 2 ── Mock data ───────────────────────────────────
    paso(2, "Insertando mock data  (data_injection.js)");
    await seedAll(db);

    // 3 ── Índices ─────────────────────────────────────
    paso(3, "Creando índices       (index_creator.js)");
    await crearIndices(db);

    // 4 ── Imágenes GridFS ─────────────────────────────
    paso(4, "Subiendo imágenes     (gridfs.js)");
    await subirImagenes(db, "ambos");

    // Resumen
    const seg = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`\n${"═".repeat(52)}`);
    console.log(`  Setup completo en ${seg}s`);
    console.log(`${"═".repeat(52)}\n`);

  } catch (err) {
    console.error("\n Error en el setup:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();