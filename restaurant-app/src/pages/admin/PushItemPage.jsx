import { useState } from "react";
import { pushItemToRestaurant } from "../../services/adminService";

function PushItemPage() {
  const [form, setForm] = useState({
    restaurante_id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    disponible: true,
    imagen_url: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await pushItemToRestaurant({
        ...form,
        precio: Number(form.precio),
      });
      setMessage("Artículo agregado con push correctamente");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Agregar artículo con push</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={String(form[key])}
          onChange={handleChange}
          placeholder={key}
          style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
        />
      ))}

      <button onClick={handleSubmit}>Agregar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PushItemPage;