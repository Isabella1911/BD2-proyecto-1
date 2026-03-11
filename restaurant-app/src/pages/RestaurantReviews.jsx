// =====================================================
// Página: Reseñas de un Restaurante
// Archivo: src/pages/RestaurantReviews.jsx
// Cambio: agrega búsqueda por nombre de usuario
// =====================================================

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import ReviewList from "../components/reviews/ReviewList";
import ReviewSortFilter from "../components/reviews/ReviewSortFilter";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useReviews } from "../context/ReviewsContext";
import { getRestaurantById } from "../services/restaurantService";

function RestaurantReviews() {
  const { id } = useParams();
  const { fetchReviewsByRestaurantId } = useReviews();

  const [restaurant, setRestaurant]   = useState(null);
  const [reviews, setReviews]         = useState([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType]       = useState("recent");
  const [isLoading, setIsLoading]     = useState(true);
  const [searchName, setSearchName]   = useState("");   // ← búsqueda por nombre

  const reviewsPerPage = 25;

  useEffect(() => {
    getRestaurantById(id).then(setRestaurant);
  }, [id]);

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      try {
        const data = await fetchReviewsByRestaurantId(id, currentPage, reviewsPerPage, sortType);
        setReviews(data.reviews);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [id, currentPage, sortType]);

  const handleSortChange = (newSort) => {
    setSortType(newSort);
    setCurrentPage(1);
  };

  // Filtro local por nombre — no requiere nueva llamada al backend
  const filteredReviews = searchName.trim()
    ? reviews.filter((r) =>
        r.usuario_nombre?.toLowerCase().includes(searchName.toLowerCase())
      )
    : reviews;

  const averageRating =
    reviews.length
      ? (reviews.reduce((sum, r) => sum + r.calificacion_num, 0) / reviews.length).toFixed(1)
      : null;

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <LoadingSpinner text="Cargando restaurante..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 0", maxHeight: "85vh", overflowY: "auto" }}>
      <PageHeader
        title={`Reseñas de ${restaurant.name}`}
        subtitle={
          averageRating
            ? `Promedio: ${averageRating} ⭐ · ${total} reseñas`
            : "Sin reseñas aún"
        }
      />

      <ReviewSortFilter sortType={sortType} onSortChange={handleSortChange} />

      {/* Búsqueda por nombre */}
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Buscar por nombre de usuario..."
        style={{
          display: "block",
          width: "100%",
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
          borderRadius: "var(--radius-md)",
          border: "2px solid var(--color-muted)",
          backgroundColor: "#fffaf0",
          color: "var(--color-dark)",
          fontSize: "1rem",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      {isLoading ? (
        <LoadingSpinner text="Cargando reseñas..." />
      ) : (
        <>
          {filteredReviews.length === 0 ? (
            <p style={{ color: "var(--color-muted)", textAlign: "center", marginTop: "2rem" }}>
              No se encontraron reseñas para "{searchName}".
            </p>
          ) : (
            <ReviewList reviews={filteredReviews} />
          )}

          {/* Solo muestra paginación si no hay búsqueda activa */}
          {!searchName.trim() && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default RestaurantReviews;