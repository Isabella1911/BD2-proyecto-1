function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "1.5rem",
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={buttonStyle(currentPage === 1)}
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            ...buttonStyle(false),
            backgroundColor:
              currentPage === page
                ? "var(--color-primary)"
                : "var(--color-surface)",
            color:
              currentPage === page
                ? "var(--color-bg)"
                : "var(--color-dark)",
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={buttonStyle(currentPage === totalPages)}
      >
        Siguiente
      </button>
    </div>
  );
}

function buttonStyle(disabled) {
  return {
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    border: "none",
    backgroundColor: disabled ? "var(--color-muted)" : "var(--color-dark)",
    color: "var(--color-bg)",
    fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

export default Pagination;