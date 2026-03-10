// =====================================================
// Servicio: Órdenes
// Colección: ordenes
// =====================================================

const { getDb } = require("../db");

// ── POST /api/ordenes ─────────────────────────────────
// Documentos Embedded: crea una orden con items embebidos
// Usada en: CartContext / checkout → createOrder()
async function createOrder(data) {
  const db = getDb();

  const newOrder = {
    _id: `ord_${Date.now()}`,
    usuario_id: data.usuario_id,
    restaurante_id: data.restaurante_id,
    fecha_pedido: new Date(),
    estado: "Pendiente", // siempre inicia en Pendiente
    monto_total: data.monto_total,
    direccion_entrega: data.direccion_entrega,
    metodo_pago: data.metodo_pago,
    // Items embebidos: snapshot histórico del momento de compra
    items: data.items.map((item) => ({
      articulo_id: item.articulo_id,
      nombre: item.nombre,
      precio_unitario: item.precio_unitario,
      cantidad: item.cantidad,
      subtotal: parseFloat((item.precio_unitario * item.cantidad).toFixed(2)),
    })),
  };

  const result = await db.collection("ordenes").insertOne(newOrder);
  return { insertedId: result.insertedId, ...newOrder };
}

// ── GET /api/ordenes/usuario/:usuarioId ───────────────
// Usada en: OrdersContext, History.jsx → getOrdersByUserId()
async function getOrdersByUserId(usuarioId) {
  const db = getDb();

  return await db
    .collection("ordenes")
    .find(
      { usuario_id: usuarioId },
      {
        projection: {
          _id: 1,
          restaurante_id: 1,
          fecha_pedido: 1,
          estado: 1,
          monto_total: 1,
          items: 1,
        },
      }
    )
    .sort({ fecha_pedido: -1 }) // índice: idx_ordenes_usuario_fecha
    .toArray();
}

// ── GET /api/ordenes/:id ──────────────────────────────
// Usada en: OrderDetail.jsx → getOrderById()
async function getOrderById(orderId) {
  const db = getDb();

  return await db.collection("ordenes").findOne({ _id: orderId });
}

// ── PATCH /api/ordenes/:id/estado ────────────────────
// Actualización: cambiar el estado de una orden específica
// Usada en: panel admin o seguimiento de orden
async function updateOrderStatus(orderId, nuevoEstado) {
  const db = getDb();

  const ESTADOS_VALIDOS = ["Pendiente", "En Ruta", "Entregado", "Cancelado"];
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    throw new Error(`Estado inválido: ${nuevoEstado}`);
  }

  const result = await db
    .collection("ordenes")
    .updateOne({ _id: orderId }, { $set: { estado: nuevoEstado } });

  return result;
}

// ── PATCH /api/ordenes/:id/items/:articuloId/cantidad ─
// Manejo de Embedded: actualizar la cantidad de un item en una orden
async function updateItemQuantity(orderId, articuloId, nuevaCantidad) {
  const db = getDb();

  const result = await db.collection("ordenes").updateOne(
    {
      _id: orderId,
      "items.articulo_id": articuloId, // filtra dentro del array embebido
    },
    {
      $set: {
        "items.$.cantidad": nuevaCantidad, // operador posicional $
        "items.$.subtotal": nuevaCantidad, // se recalcula en el backend con precio
      },
    }
  );

  return result;
}

// ── GET /api/ordenes/restaurante/:id/entregadas ───────
// Ordenamiento + Proyección + Paginación:
// Órdenes entregadas de un restaurante, solo ciertos campos
// Usada en: panel del restaurante / reportes
async function getDeliveredOrdersByRestaurant(restaurantId, page = 1, limit = 10) {
  const db = getDb();

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    db
      .collection("ordenes")
      .find(
        { restaurante_id: restaurantId, estado: "Entregado" },
        {
          // Proyección: solo los campos necesarios
          projection: {
            _id: 1,
            usuario_id: 1,
            fecha_pedido: 1,
            monto_total: 1,
            items: 1,
            metodo_pago: 1,
            direccion_entrega: 1,
          },
        }
      )
      .sort({ fecha_pedido: -1 }) // índice: idx_ordenes_restaurante_estado_fecha
      .skip(skip)
      .limit(limit)
      .toArray(),

    db.collection("ordenes").countDocuments({
      restaurante_id: restaurantId,
      estado: "Entregado",
    }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  updateItemQuantity,
  getDeliveredOrdersByRestaurant,
};