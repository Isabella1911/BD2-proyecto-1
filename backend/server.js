// =====================================================
// server.js — Punto de entrada del backend
// =====================================================

const express = require("express");
const cors = require("cors");
const { connectDb } = require("./db");

// Rutas
const restaurantesRouter = require("./routes/restaurantes");
const ordenesRouter      = require("./routes/ordenes");
const reseniasRouter     = require("./routes/resenias");
const statsRouter        = require("./routes/stats");
const imagenesRouter     = require("./routes/imagenes");
const usuariosRouter     = require("./routes/usuarios");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" })); // puerto de Vite
app.use(express.json());

// ── Rutas ─────────────────────────────────────────────
app.use("/api/restaurantes", restaurantesRouter);
app.use("/api/ordenes",      ordenesRouter);
app.use("/api/resenias",     reseniasRouter);
app.use("/api/stats",        statsRouter);
app.use("/api/imagenes",     imagenesRouter);
app.use("/api/usuarios",    usuariosRouter);

// ── Arranque ──────────────────────────────────────────
async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

start();