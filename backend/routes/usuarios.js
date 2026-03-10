// =====================================================
// Rutas: Usuarios
// Base: /api/usuarios
// =====================================================

const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../services/userService");

// GET /api/usuarios/email/:email
// → LoginScreen.jsx: busca el usuario al hacer login
router.get("/email/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;