import { orders } from "../data/ordersMockData";

export async function getOrdersByUserId(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders.filter((order) => order.usuario_id === Number(userId)));
    }, 400);
  });
}

export async function getOrderById(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders.find((item) => item.id === Number(orderId));
      resolve(order || null);
    }, 400);
  });
}