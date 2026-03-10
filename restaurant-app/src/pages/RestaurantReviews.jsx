// =====================================================
// Página: Reseñas de un Restaurante
// Actualiza: src/pages/RestaurantReviews.jsx
// Cambio: paginación y sort vienen del backend ahora
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

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);

  const reviewsPerPage = 25;

  // Carga el restaurante una sola vez
  useEffect(() => {
    getRestaurantById(id).then(setRestaurant);
  }, [id]);

  // Recarga reseñas cada vez que cambia página o sort
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

  // Al cambiar el sort vuelve a página 1
  const handleSortChange = (newSort) => {
    setSortType(newSort);
    setCurrentPage(1);
  };

  const averageRating = reviews.length
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

      {isLoading ? (
        <LoadingSpinner text="Cargando reseñas..." />
      ) : (
        <>
          <ReviewList reviews={reviews} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default RestaurantReviews;