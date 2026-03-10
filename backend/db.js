// =====================================================
// Conexión a MongoDB
// Todos los servicios importan getDb() desde aquí
// =====================================================

const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

let db = null;

async function connectDb() {
  if (db) return db;

  const client = new MongoClient(URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✅ Conectado a MongoDB: ${DB_NAME}`);
  return db;
}

function getDb() {
  if (!db) throw new Error("DB no inicializada. Llama connectDb() primero.");
  return db;
}

module.exports = { connectDb, getDb };