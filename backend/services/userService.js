// =====================================================
// Servicio: Usuarios
// Colección: usuarios
// =====================================================

const { getDb } = require("../db");

// ── GET /api/usuarios/email/:email ────────────────────
// Busca un usuario por email — usado en el login
// Aprovecha el índice único idx_usuarios_email
async function getUserByEmail(email) {
  const db = getDb();
  return await db.collection("usuarios").findOne(
    { email },
    { projection: { _id: 1, nombre: 1, email: 1, direccion: 1, telefono: 1 } }
  );
}

module.exports = { getUserByEmail };