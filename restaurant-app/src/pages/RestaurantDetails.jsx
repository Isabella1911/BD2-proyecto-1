import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import RestaurantHero from "../components/restaurant-details/RestaurantHero";
import RestaurantInfo from "../components/restaurant-details/RestaurantInfo";
import MenuList from "../components/restaurant-details/MenuList";
import {
  getRestaurantById,
  getMenuItemsByRestaurantId,
} from "../services/restaurantService";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurantDetails() {
      try {
        const [restaurantData, menuData] = await Promise.all([
          getRestaurantById(id),
          getMenuItemsByRestaurantId(id),
        ]);

        setRestaurant(restaurantData);
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error al cargar restaurante:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRestaurantDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <LoadingSpinner text="Cargando restaurante..." />
      </div>
    );
  }

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
          <h2 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>
            Restaurante no encontrado
          </h2>
          <p>No existe un restaurante con ese id.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <RestaurantHero restaurant={restaurant} />
      <RestaurantInfo totalItems={menuItems.length} />
      <MenuList
        items={menuItems}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </div>
  );
}

export default RestaurantDetails;