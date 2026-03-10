function StarRating({ rating = 0, onClick, clickable = false }) {

  const numericRating = Number(rating) || 0;
  const rounded = Math.round(numericRating);

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
        {numericRating.toFixed(1)}
      </span>
    </div>
  );
}

export default StarRating;