import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import ReviewList from "../components/reviews/ReviewList";
import ReviewSortFilter from "../components/reviews/ReviewSortFilter";
import { useReviews } from "../context/ReviewsContext";
import { getRestaurantById } from "../services/restaurantService";

function RestaurantReviews() {
  const { id } = useParams();

  const {
    getReviewsByRestaurantId,
    getAverageRatingByRestaurantId,
    getReviewsCountByRestaurantId,
  } = useReviews();

  const [restaurant, setRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("recent");

  const reviewsPerPage = 25;

  useEffect(() => {
    async function loadRestaurant() {
      const data = await getRestaurantById(id);
      setRestaurant(data);
    }

    loadRestaurant();
  }, [id]);

  const allReviews = useMemo(() => {
    let reviews = [...getReviewsByRestaurantId(id)];

    if (sortType === "best") {
      reviews.sort((a, b) => b.calificacion_num - a.calificacion_num);
    }

    if (sortType === "worst") {
      reviews.sort((a, b) => a.calificacion_num - b.calificacion_num);
    }

    if (sortType === "recent") {
      reviews.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    return reviews;
  }, [getReviewsByRestaurantId, id, sortType]);

  const averageRating = getAverageRatingByRestaurantId(id);
  const totalReviews = getReviewsCountByRestaurantId(id);

  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    return allReviews.slice(start, end);
  }, [allReviews, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortType, id]);

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2 style={{ color: "var(--color-primary)" }}>
            Restaurante no encontrado
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        padding: "2rem 0",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <PageHeader
        title={`Reseñas de ${restaurant.name}`}
        subtitle={`Promedio: ${
          averageRating ? averageRating.toFixed(1) : "0.0"
        } ⭐ · ${totalReviews} reseñas`}
      />

      <ReviewSortFilter sortType={sortType} onChangeSort={setSortType} />

      <ReviewList reviews={paginatedReviews} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default RestaurantReviews;