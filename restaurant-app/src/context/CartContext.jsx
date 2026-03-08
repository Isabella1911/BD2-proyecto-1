import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (restaurantId, restaurantName, item, quantity) => {
  setCartItems((prevItems) => {
    if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurantId) {
      alert("Solo puedes agregar artículos de un restaurante a la vez.");
      return prevItems;
    }

    const existingItem = prevItems.find(
      (cartItem) => cartItem.articulo_id === item.id
    );

    if (existingItem) {
      return prevItems.map((cartItem) =>
        cartItem.articulo_id === item.id
          ? { ...cartItem, cantidad: cartItem.cantidad + quantity }
          : cartItem
      );
    }

    return [
      ...prevItems,
      {
        articulo_id: item.id,
        restaurantId,
        restaurantName,
        nombre: item.name,
        precio_unitario: item.price,
        cantidad: quantity,
        image_url: item.image_url,
      },
    ];
  });
};

  const removeFromCart = (articuloId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.articulo_id !== articuloId)
    );
  };

  const increaseQuantity = (articuloId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.articulo_id === articuloId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (articuloId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.articulo_id === articuloId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartRestaurant = cartItems.length > 0 ? cartItems[0].restaurantName : "";

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.cantidad, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.precio_unitario * item.cantidad,
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,
    cartRestaurant,
    totalItems,
    totalAmount,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}