function ReviewSortFilter({ sortType, onChangeSort }) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <select
        value={sortType}
        onChange={(e) => onChangeSort(e.target.value)}
        style={{
          padding: "0.6rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-muted)",
          backgroundColor: "var(--color-surface)",
          fontWeight: "bold",
        }}
      >
        <option value="recent">Más recientes</option>
        <option value="best">Mejor calificadas</option>
        <option value="worst">Peor calificadas</option>
      </select>
    </div>
  );
}

export default ReviewSortFilter;