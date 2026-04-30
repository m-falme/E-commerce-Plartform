import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      // If user logs out, clear the cart from state
      setCart([]);
      setCartCount(0);
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      // No need to add token manually — the interceptor in api.js handles it
      const res = await API.get("/cart/");
      setCart(res.data.items || []);
      // Calculate total item count for the navbar badge
      const count = (res.data.items || []).reduce(
        (sum, item) => sum + item.quantity, 0
      );
      setCartCount(count);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await API.post("/cart/add", { product_id: productId, quantity });
      // Re-fetch cart to get updated state with product details
      await fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      throw err; // Re-throw so the component can show an error message
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await API.delete(`/cart/remove/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await API.put(`/cart/update/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}