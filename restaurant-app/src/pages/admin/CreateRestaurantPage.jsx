import { useState } from "react";
import { createRestaurant } from "../../services/adminService";

function CreateRestaurantPage() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    tipo_cocina: "",
    horario: "",
    imagen_url: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        calificacion_promedio: 0,
        articulos_ids: [],
        fecha_registro: new Date().toISOString(),
      };

      await createRestaurant(payload);
      setMessage("Restaurante creado correctamente");
      setForm({
        nombre: "",
        direccion: "",
        telefono: "",
        tipo_cocina: "",
        horario: "",
        imagen_url: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Crear restaurante</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key}
          style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
        />
      ))}

      <button onClick={handleSubmit}>Crear</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateRestaurantPage;