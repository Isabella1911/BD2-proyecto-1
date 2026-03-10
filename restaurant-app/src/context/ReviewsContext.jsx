// =====================================================
// Context: Reseñas
// Reemplaza: src/context/ReviewsContext.jsx
// =====================================================

import { createContext, useContext, useEffect, useState } from "react";
import { currentUser } from "../data/currentUser";
import {
  createReview as createReviewApi,
  deleteReview as deleteReviewApi,
  getReviewsByRestaurantId as getReviewsApi,
  getReviewsByUserId,
} from "../services/reviewService";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  // Cache por restaurante: { [restauranteId]: { reviews, total, page, totalPages } }
  const [cache, setCache] = useState({});
  // Reseñas del usuario actual para History.jsx
  const [userReviews, setUserReviews] = useState([]);

  // Carga las reseñas del usuario al montar
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
  }, []);

  // ── Usado en RestaurantReviews.jsx ──────────────────
  const fetchReviewsByRestaurantId = async (restaurantId, page = 1, limit = 25, sort = "recent") => {
    const data = await getReviewsApi(restaurantId, page, limit, sort);
    setCache((prev) => ({ ...prev, [restaurantId]: data }));
    return data;
  };

  // Para compatibilidad con componentes que leen del cache
  const getReviewsByRestaurantId = (restaurantId) => {
    return cache[restaurantId]?.reviews || [];
  };

  const getAverageRatingByRestaurantId = (restaurantId) => {
    const reviews = cache[restaurantId]?.reviews || [];
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.calificacion_num, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getReviewsCountByRestaurantId = (restaurantId) => {
    return cache[restaurantId]?.total || 0;
  };

  const hasUserReviewedOrder = (orderId) => {
    return userReviews.some(
      (r) => r.usuario_id === currentUser.id && r.orden_id === orderId
    );
  };

  // ── Usado en ReviewModal.jsx ─────────────────────────
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

      // Actualiza userReviews para que History.jsx lo refleje de inmediato
      setUserReviews((prev) => [normalized, ...prev]);

      // Actualiza cache del restaurante si ya estaba cargado
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

  // ── Usado en perfil de usuario ───────────────────────
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