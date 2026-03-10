import { useState } from "react";
import { addUniqueItem } from "../../services/adminService";

function AddUniqueItemPage() {
  const [restauranteId, setRestauranteId] = useState("");
  const [articuloId, setArticuloId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await addUniqueItem({
        restaurante_id: restauranteId,
        articulo_id: articuloId,
      });
      setMessage("Artículo agregado sin duplicados");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Agregar artículo sin duplicados</h1>

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

      <button onClick={handleSubmit}>Agregar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddUniqueItemPage;