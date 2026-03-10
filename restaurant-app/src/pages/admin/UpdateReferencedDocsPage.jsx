import { useState } from "react";
import { updateReferencedDocs } from "../../services/adminService";

function UpdateReferencedDocsPage() {
  const [restauranteId, setRestauranteId] = useState("");
  const [articulosIds, setArticulosIds] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const ids = articulosIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      await updateReferencedDocs({
        restaurante_id: restauranteId,
        articulos_ids: ids,
      });

      setMessage("Documentos referenced actualizados correctamente");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Actualizar documentos referenced</h1>

      <input
        value={restauranteId}
        onChange={(e) => setRestauranteId(e.target.value)}
        placeholder="ID del restaurante"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      />

      <textarea
        value={articulosIds}
        onChange={(e) => setArticulosIds(e.target.value)}
        placeholder="IDs de artículos separados por coma"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px", minHeight: "120px" }}
      />

      <button onClick={handleSubmit}>Actualizar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateReferencedDocsPage;