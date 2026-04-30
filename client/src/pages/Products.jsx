import { useEffect, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/CartContext";

// Products page:
// 1. Fetches all products from Flask on load
// 2. Lets user filter by category
// 3. Lets user search by name
// 4. Each product card has an "Add to Cart" button
// 5. Shows a toast notification when item is added

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const { addToCart } = useCart();

  // Fetch products from Flask backend on first render
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []); // [] = run once on mount

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/products/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id);
      // Show toast notification
      setToast(`${product.name} added to cart`);
      // Hide it after 2.5 seconds
      // setTimeout runs a function after a delay (in milliseconds)
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast("Please log in to add items");
      setTimeout(() => setToast(""), 2500);
    }
  };

  // FILTERING — done on the frontend without extra API calls
  // .filter() returns a new array with only items that pass the test
  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    // .toLowerCase() makes search case-insensitive
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", letterSpacing: "0.2em", fontSize: "0.85rem", textTransform: "uppercase" }}>
          Loading collection...
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ padding: "3rem 2rem 6rem" }}>

        {/* Page header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ color: "var(--gold)", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Our Collection
          </p>
          <h2 style={{ marginBottom: "0.5rem" }}>Shop All Products</h2>
          <div className="divider" />
        </div>

        {/* Search + Filter bar */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          {/* Search input */}
          <input
            className="input"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "300px" }}
          />

          {/* Category filter buttons */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.5rem 1.2rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: selectedCategory === cat ? "var(--gold)" : "transparent",
                  color: selectedCategory === cat ? "var(--black)" : "var(--muted)",
                  border: "1px solid",
                  borderColor: selectedCategory === cat ? "var(--gold)" : "var(--border)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginLeft: "auto" }}>
            {filtered.length} items
          </span>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "var(--muted)" }}>No products found</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            // auto-fit + minmax = responsive grid without media queries
            // Each column is at least 280px wide, fills available space
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }} className="stagger">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="toast">
          <span style={{ color: "var(--gold)", marginRight: "0.5rem" }}>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  // Placeholder image using a color based on product id
  // When you add real image_url to your products, replace this
  const colors = ["#1a1a2e", "#16213e", "#1a2a1a", "#2e1a1a", "#1a1a2e"];
  const bgColor = colors[product.id % colors.length];

  return (
    <div className="card fade-up" style={{ display: "flex", flexDirection: "column" }}>
      {/* Product image area */}
      <div style={{
        height: "220px",
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            color: "rgba(201,168,76,0.15)",
            userSelect: "none",
          }}>
            {product.name.charAt(0)}
          </div>
        )}
        {/* Category badge */}
        {product.category && (
          <span style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            padding: "0.25rem 0.75rem",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid var(--border)",
            borderRadius: "99px",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}>
            {product.category}
          </span>
        )}
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "var(--muted)", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase" }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 400,
          marginBottom: "0.4rem",
          color: "var(--white)",
        }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            fontSize: "0.82rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: "1rem",
            flex: 1,
            // Clamp to 2 lines with ellipsis for overflow
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {product.description}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: "var(--gold)",
          }}>
            KSh {product.price.toLocaleString()}
          </span>

          <button
            className="btn btn-outline"
            onClick={onAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: "0.5rem 1.2rem",
              fontSize: "0.75rem",
              opacity: product.stock === 0 ? 0.4 : 1,
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}