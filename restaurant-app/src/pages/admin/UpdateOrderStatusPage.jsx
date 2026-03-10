// =====================================================
// Página: Cambiar estado de una orden
// Ruta: /admin/update-order-status
// Archivo: src/pages/admin/UpdateOrderStatusPage.jsx
// =====================================================

import { useState } from "react";
import { updateOrderStatus } from "../../services/adminService";

// Estados válidos según el backend (orderService.js):
// "Pendiente" | "En Ruta" | "Entregado" | "Cancelado"
const ESTADOS = ["Pendiente", "En Ruta", "Entregado", "Cancelado"];

function UpdateOrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [estado, setEstado]   = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await updateOrderStatus(orderId, estado);
      setMessage("Estado actualizado correctamente");
      setOrderId("");
      setEstado("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Cambiar estado de una orden</h1>

      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="ID de la orden"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      >
        <option value="">Selecciona estado</option>
        {ESTADOS.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <button onClick={handleSubmit} disabled={!orderId || !estado}>
        Actualizar
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateOrderStatusPage;