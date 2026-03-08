import { createContext, useContext, useMemo, useState } from "react";
import { reviews as initialReviews } from "../data/reviewsMockData";
import { currentUser } from "../data/currentUser";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(initialReviews);

  const userReviews = useMemo(() => {
    return reviews.filter((review) => review.usuario_id === currentUser.id);
  }, [reviews]);

  const createReview = ({
    restaurante_id,
    restaurante_nombre,
    orden_id = null,
    calificacion_num,
    comentario,
  }) => {
    if (orden_id !== null) {
      const alreadyReviewed = reviews.some(
        (review) =>
          review.usuario_id === currentUser.id &&
          review.orden_id === orden_id
      );

      if (alreadyReviewed) {
        return {
          success: false,
          message: "Esta orden ya fue calificada por el usuario.",
        };
      }
    }

    const newReview = {
      id: Date.now(),
      usuario_id: currentUser.id,
      usuario_nombre: currentUser.nombre,
      restaurante_id,
      restaurante_nombre,
      orden_id,
      calificacion_num,
      comentario,
      fecha: new Date().toLocaleString("es-GT"),
    };

    setReviews((prev) => [newReview, ...prev]);

    return {
      success: true,
      review: newReview,
    };
  };

  const getAverageRatingByRestaurantId = (restaurantId) => {
    const restaurantReviews = reviews.filter(
      (review) => review.restaurante_id === Number(restaurantId)
    );

    if (!restaurantReviews.length) return 0;

    const total = restaurantReviews.reduce(
      (sum, review) => sum + review.calificacion_num,
      0
    );

    return total / restaurantReviews.length;
  };

  const getReviewsCountByRestaurantId = (restaurantId) => {
    return reviews.filter(
      (review) => review.restaurante_id === Number(restaurantId)
    ).length;
  };

  const getReviewsByRestaurantId = (restaurantId) => {
    return reviews
      .filter((review) => review.restaurante_id === Number(restaurantId))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  const hasUserReviewedOrder = (orderId) => {
    return reviews.some(
      (review) =>
        review.usuario_id === currentUser.id &&
        review.orden_id === Number(orderId)
    );
  };

  const value = {
    reviews,
    userReviews,
    createReview,
    getAverageRatingByRestaurantId,
    getReviewsCountByRestaurantId,
    getReviewsByRestaurantId,
    hasUserReviewedOrder,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}