function ReviewCardDetailed({ review }) {
  return (
    <article
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1rem",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h3 style={{ color: "var(--color-primary)", marginBottom: "0.25rem" }}>
            {review.usuario_nombre}
          </h3>
          <p style={{ color: "var(--color-muted)", fontSize: "0.95rem" }}>
            {review.fecha}
          </p>
        </div>

        <span
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-bg)",
            padding: "0.45rem 0.8rem",
            borderRadius: "999px",
            fontWeight: "bold",
            height: "fit-content",
          }}
        >
          {"⭐".repeat(review.calificacion_num)}
        </span>
      </div>

      <p style={{ lineHeight: 1.6 }}>{review.comentario}</p>
    </article>
  );
}

export default ReviewCardDetailed;