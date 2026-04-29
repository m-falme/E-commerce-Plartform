import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false); // Button loading state
  const [added, setAdded] = useState(false);   // Show "Added!" confirmation
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = async (e) => {
    // e.stopPropagation() prevents the click from bubbling up to the
    // card's click handler (which navigates to the product page)
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    setAdding(true);
    const result = await addToCart(product.id);
    setAdding(false);

    if (result.success) {
      // Show "Added!" for 1.5 seconds then reset
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  // Fallback image if the product has no image_url
  const imageSrc = product.image_url ||
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format`;

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── PRODUCT IMAGE ── */}
      <div style={styles.imageWrap}>
        <img
          src={imageSrc}
          alt={product.name}
          style={styles.image}
          onError={(e) => {
            // If image fails to load, show a placeholder
            e.target.src = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop`;
          }}
        />
        {/* Category badge */}
        {product.category && (
          <span style={styles.categoryBadge}>{product.category}</span>
        )}
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div style={styles.outOfStock}>Out of Stock</div>
        )}
      </div>

      {/* ── PRODUCT INFO ── */}
      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>

        {product.description && (
          <p style={styles.description}>
            {/* Truncate description to 80 chars */}
            {product.description.length > 80
              ? product.description.slice(0, 80) + "..."
              : product.description}
          </p>
        )}

        <div style={styles.footer}>
          <span style={styles.price}>
            KES {product.price.toLocaleString()}
          </span>

          <button
            className="btn-primary"
            style={{
              ...styles.addBtn,
              ...(added ? styles.addedBtn : {}),
              opacity: product.stock === 0 ? 0.4 : 1,
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
            }}
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {/* Button text changes based on state */}
            {adding ? "Adding..." : added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  cardHover: {
    transform: "translateY(-4px)",
    borderColor: "var(--border-gold)",
    boxShadow: "var(--shadow-card)",
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    paddingTop: "100%", // 1:1 aspect ratio trick
    overflow: "hidden",
    background: "var(--bg-secondary)",
  },
  image: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  categoryBadge: {
    position: "absolute",
    top: 12, left: 12,
    background: "rgba(10,10,10,0.8)",
    color: "var(--gold)",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    backdropFilter: "blur(4px)",
    border: "1px solid var(--border-gold)",
  },
  outOfStock: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 1,
  },
  info: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
  },
  name: {
    fontFamily: "var(--font-display)",
    fontSize: 17,
    fontWeight: 600,
    color: "var(--text-primary)",
    lineHeight: 1.3,
  },
  description: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
    flex: 1,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  price: {
    fontFamily: "var(--font-display)",
    fontSize: 18,
    fontWeight: 700,
    color: "var(--gold)",
  },
  addBtn: {
    fontSize: 12,
    padding: "9px 16px",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
  },
  addedBtn: {
    background: "#2a7a4a",
    color: "#fff",
  },
};

export default ProductCard;