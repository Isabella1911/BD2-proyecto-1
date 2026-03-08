import { useState } from "react";

function ReviewModal({ title, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ calificacion_num: rating, comentario: comment });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "min(90%, 450px)",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
          {title}
        </h2>

        <label style={labelStyle}>Calificación</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={1}>1 estrella</option>
          <option value={2}>2 estrellas</option>
          <option value={3}>3 estrellas</option>
          <option value={4}>4 estrellas</option>
          <option value={5}>5 estrellas</option>
        </select>

        <label style={labelStyle}>Comentario</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{ ...inputStyle, resize: "none" }}
          placeholder="Escribe tu reseña"
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: "var(--color-muted)" }}>
            Cancelar
          </button>
          <button type="submit" style={buttonStyle}>
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "0.4rem",
  marginTop: "0.8rem",
  fontWeight: "bold",
  color: "var(--color-dark)",
};

const inputStyle = {
  width: "100%",
  padding: "0.9rem 1rem",
  borderRadius: "var(--radius-md)",
  border: "2px solid var(--color-muted)",
  backgroundColor: "#fffaf0",
  color: "var(--color-dark)",
  outline: "none",
};

const buttonStyle = {
  padding: "0.8rem 1rem",
  border: "none",
  borderRadius: "var(--radius-md)",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-bg)",
  fontWeight: "bold",
};

export default ReviewModal;