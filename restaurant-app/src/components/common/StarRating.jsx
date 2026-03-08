function StarRating({ rating, onClick, clickable = false }) {
  const rounded = Math.round(rating);

  return (
    <div
      onClick={clickable ? onClick : undefined}
      style={{
        display: "flex",
        gap: "0.2rem",
        cursor: clickable ? "pointer" : "default",
        alignItems: "center",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ fontSize: "1.2rem" }}>
          {star <= rounded ? "★" : "☆"}
        </span>
      ))}
      <span style={{ marginLeft: "0.4rem", fontWeight: "bold" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default StarRating;