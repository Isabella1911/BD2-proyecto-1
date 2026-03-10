// =====================================================
// Context: Reseñas
// Reemplaza: src/context/ReviewsContext.jsx
// =====================================================

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  createReview as createReviewApi,
  deleteReview as deleteReviewApi,
  getReviewsByRestaurantId as getReviewsApi,
  getReviewsByUserId,
} from "../services/reviewService";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const { currentUser } = useAuth();
  const [cache, setCache]           = useState({});
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    async function loadUserReviews() {
      try {
        const data = await getReviewsByUserId(currentUser.id);
        setUserReviews(data);
      } catch (err) {
        console.error("Error al cargar reseñas del usuario:", err);
      }
    }
    loadUserReviews();
  }, [currentUser.id]);

  const fetchReviewsByRestaurantId = async (restaurantId, page = 1, limit = 25, sort = "recent") => {
    const data = await getReviewsApi(restaurantId, page, limit, sort);
    setCache((prev) => ({ ...prev, [restaurantId]: data }));
    return data;
  };

  const getReviewsByRestaurantId = (restaurantId) =>
    cache[restaurantId]?.reviews || [];

  const getAverageRatingByRestaurantId = (restaurantId) => {
    const reviews = cache[restaurantId]?.reviews || [];
    if (!reviews.length) return 0;
    return (reviews.reduce((sum, r) => sum + r.calificacion_num, 0) / reviews.length).toFixed(1);
  };

  const getReviewsCountByRestaurantId = (restaurantId) =>
    cache[restaurantId]?.total || 0;

  const hasUserReviewedOrder = (orderId) =>
    userReviews.some((r) => r.usuario_id === currentUser.id && r.orden_id === orderId);

  const createReview = async ({
    restaurante_id,
    restaurante_nombre,
    orden_id = null,
    calificacion_num,
    comentario,
  }) => {
    if (orden_id !== null && hasUserReviewedOrder(orden_id)) {
      return { success: false, message: "Esta orden ya fue calificada." };
    }

    try {
      const newReview = await createReviewApi({
        usuario_id: currentUser.id,
        restaurante_id,
        orden_id,
        calificacion_num,
        comentario,
      });

      const normalized = {
        id: newReview._id,
        usuario_id: currentUser.id,
        usuario_nombre: currentUser.nombre,
        restaurante_id,
        restaurante_nombre,
        orden_id,
        calificacion_num,
        comentario,
        fecha: newReview.fecha,
      };

      setUserReviews((prev) => [normalized, ...prev]);
      setCache((prev) => {
        const existing = prev[restaurante_id] || { reviews: [], total: 0 };
        return {
          ...prev,
          [restaurante_id]: {
            ...existing,
            reviews: [normalized, ...existing.reviews],
            total: existing.total + 1,
          },
        };
      });

      return { success: true, review: normalized };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteReview = async (reviewId, restauranteId) => {
    await deleteReviewApi(reviewId);
    setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setCache((prev) => {
      const existing = prev[restauranteId] || { reviews: [], total: 0 };
      return {
        ...prev,
        [restauranteId]: {
          ...existing,
          reviews: existing.reviews.filter((r) => r.id !== reviewId),
          total: Math.max(0, existing.total - 1),
        },
      };
    });
  };

  return (
    <ReviewsContext.Provider
      value={{
        userReviews,
        fetchReviewsByRestaurantId,
        getReviewsByRestaurantId,
        getAverageRatingByRestaurantId,
        getReviewsCountByRestaurantId,
        hasUserReviewedOrder,
        createReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}