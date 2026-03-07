// =====================================================
// Proyecto 01 - MongoDB | Setup Principal
// Corre todos los scripts de inicialización en orden
// =====================================================

const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../../.env' });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME 

const setupRestaurantes = require("./collections/restaurantes");
const setupUsuarios = require("./collections/usuarios");
const setupArticulos = require("./collections/articulos");
const setupOrdenes = require("./collections/ordenes");
const setupResenias = require("./collections/resenias");

async function main() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");

    const db = client.db(DB_NAME);

    await setupRestaurantes(db);
    await setupUsuarios(db);
    await setupArticulos(db);
    await setupOrdenes(db);
    await setupResenias(db);

    console.log("\n🎉 Setup completado exitosamente.");
  } catch (err) {
    console.error("❌ Error durante el setup:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();