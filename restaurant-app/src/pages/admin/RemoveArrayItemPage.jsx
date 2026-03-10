import { useState } from "react";
import { removeArrayItem } from "../../services/adminService";

function RemoveArrayItemPage() {
  const [restauranteId, setRestauranteId] = useState("");
  const [articuloId, setArticuloId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await removeArrayItem({
        restaurante_id: restauranteId,
        articulo_id: articuloId,
      });
      setMessage("Artículo removido del array correctamente");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Eliminar artículo del array</h1>

      <input
        value={restauranteId}
        onChange={(e) => setRestauranteId(e.target.value)}
        placeholder="ID del restaurante"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      />

      <input
        value={articuloId}
        onChange={(e) => setArticuloId(e.target.value)}
        placeholder="ID del artículo"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      />

      <button onClick={handleSubmit}>Eliminar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RemoveArrayItemPage;