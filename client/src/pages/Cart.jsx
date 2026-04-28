import { useEffect, useState } from "react";
import API from "../services/api";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      const res = await API.get("/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
    };

    fetchCart();
  }, []);

  return (
    <div>
      <h1>Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id}>
          Product ID: {item.product_id} | Qty: {item.quantity}
        </div>
      ))}
    </div>
  );
}

export default Cart;