import { useEffect, useState } from "react";
import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fakeProducts = [
    { id: 1, name: "Nike Shoes", price: 1200 },
    { id: 2, name: "Adidas T-shirt", price: 800 },
    { id: 3, name: "Cap", price: 300 },
  ];

  setProducts(fakeProducts);
}, []);

  // GET PRODUCTS
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await API.get("/products/");
  //       setProducts(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // ADD TO CART FUNCTION
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/cart/add",
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to cart");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {products.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.price}</p>

          {/* BUTTON MUST BE INSIDE MAP */}
          <button onClick={() => addToCart(p.id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Products;