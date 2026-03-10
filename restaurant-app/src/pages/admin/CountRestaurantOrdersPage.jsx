import { useState } from "react";
import { countOrdersByRestaurant } from "../../services/adminService";

function CountRestaurantOrdersPage() {
  const [restauranteId, setRestauranteId] = useState("");
  const [total, setTotal] = useState(null);
  const [message, setMessage] = useState("");

  const handleCount = async () => {
    try {
      const data = await countOrdersByRestaurant(restauranteId);
      setTotal(data.total);
      setMessage("Consulta realizada correctamente");
    } catch (error) {
      setMessage(error.message);
      setTotal(null);
    }
  };

  return (
    <div>
      <h1>Contar órdenes de un restaurante</h1>

      <input
        value={restauranteId}
        onChange={(e) => setRestauranteId(e.target.value)}
        placeholder="ID del restaurante"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      />

      <button onClick={handleCount}>Contar</button>
      {message && <p>{message}</p>}
      {total !== null && <p>Total de órdenes: <strong>{total}</strong></p>}
    </div>
  );
}

export default CountRestaurantOrdersPage;