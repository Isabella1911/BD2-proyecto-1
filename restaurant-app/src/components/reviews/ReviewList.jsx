import ReviewCardDetailed from "./ReviewCardDetailed";

function ReviewList({ reviews }) {
  if (!reviews.length) {
    return (
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          Este restaurante aún no tiene reseñas
        </h3>
        <p>Seamos los primeros en comentar.</p>
      </div>
    );
  }

  return (
    <section
      style={{
        display: "grid",
        gap: "1rem",
      }}
    >
      {reviews.map((review) => (
        <ReviewCardDetailed key={review.id} review={review} />
      ))}
    </section>
  );
}

export default ReviewList;