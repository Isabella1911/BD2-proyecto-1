import { restaurants, menuItems } from "../data/mockData";

export async function getRestaurants() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(restaurants), 400);
  });
}

export async function getRestaurantById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = restaurants.find(
        (item) => item.id === Number(id)
      );
      resolve(restaurant || null);
    }, 400);
  });
}

export async function getMenuItemsByRestaurantId(restaurantId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredItems = menuItems.filter(
        (item) => item.restaurant_id === Number(restaurantId)
      );
      resolve(filteredItems);
    }, 400);
  });
}