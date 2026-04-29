import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // cartItems: array of { id, product_id, quantity, product: {...} }
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // We need the auth context to get the token and know if logged in
  const { user, getToken } = useAuth();

  // Whenever the logged-in user changes (login/logout), refresh the cart.
  // The dependency array [user] means: re-run this effect when user changes.
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // User logged out → clear the cart from state
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const res = await API.get("/cart/", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // The API returns { items: [...], total: 99.99 }
      setCartItems(res.data.items || res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await API.post("/cart/add",
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // After adding, refresh the cart to get updated data
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await API.delete(`/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Optimistic update: remove from local state immediately
      // without waiting for another API call. Feels instant to the user.
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await API.put(`/cart/update/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      // Optimistic update: update quantity in local state immediately
      setCartItems(prev =>
        prev.map(item => item.id === itemId ? { ...item, quantity } : item)
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  // Derived values — calculated from cartItems, not stored separately.
  // These update automatically whenever cartItems changes.
  
  // Total number of items (sum of all quantities)
  // e.g. 2 shoes + 3 shirts = 5 items
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Total price
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      cartLoading, fetchCart,
      addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}