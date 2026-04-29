import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import API from "../services/api";

function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch first 4 products to show as "featured" on the homepage
    API.get("/products/")
      .then(res => setFeatured(res.data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div className="container" style={styles.heroContent}>
          <p style={styles.heroEyebrow}>◆ Premium Collection</p>
          <h1 style={styles.heroTitle}>
            Discover<br />
            <span style={styles.heroTitleGold}>Exceptional</span><br />
            Products
          </h1>
          <p style={styles.heroSubtitle}>
            Curated selection of premium items delivered to your door.
            Quality you can trust, style you'll love.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/products" className="btn-primary" style={styles.heroBtn}>
              Shop Now
            </Link>
            {!user && (
              <Link to="/register" className="btn-outline" style={styles.heroBtn}>
                Join LUXE
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div style={styles.stats}>
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Products" },
              { value: "Free", label: "Shipping over KES 5K" },
            ].map((s) => (
              <div key={s.label} style={styles.statItem}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={styles.featured}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <p style={styles.sectionEyebrow}>Hand-picked for you</p>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
          </div>

          {loading ? (
            /* Skeleton loading cards while fetching */
            <div style={styles.grid}>
              {[1,2,3,4].map(i => (
                <div key={i} style={styles.skeletonCard}>
                  <div className="skeleton" style={{ height: 220 }} />
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="skeleton" style={{ height: 20, width: "70%" }} />
                    <div className="skeleton" style={{ height: 14, width: "90%" }} />
                    <div className="skeleton" style={{ height: 14, width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div style={styles.grid}>
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No products yet — show a helpful message */
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>🛍️</p>
              <h3 style={styles.emptyTitle}>No products yet</h3>
              <p style={styles.emptyText}>
                Products will appear here once they're added to the store.
              </p>
            </div>
          )}

          {featured.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link to="/products" className="btn-outline">
                View all products →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES STRIP  */}
      <section style={styles.categories}>
        <div className="container">
          <div style={styles.catGrid}>
            {[
              { label: "Electronics", icon: "⚡" },
              { label: "Clothing",    icon: "👔" },
              { label: "Shoes",       icon: "👟" },
              { label: "Accessories", icon: "💎" },
              { label: "Home",        icon: "🏠" },
              { label: "Sports",      icon: "🏃" },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={`/products?category=${cat.label}`}
                style={styles.catItem}
              >
                <span style={styles.catIcon}>{cat.icon}</span>
                <span style={styles.catLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    position: "relative",
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    borderBottom: "1px solid var(--border)",
  },
  heroGlow: {
    position: "absolute",
    top: "-20%", left: "50%",
    transform: "translateX(-50%)",
    width: 600, height: 600,
    background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    paddingTop: 80,
    paddingBottom: 80,
  },
  heroEyebrow: {
    color: "var(--gold)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(52px, 8vw, 96px)", // clamp: min, preferred, max
    fontWeight: 700,
    lineHeight: 1.0,
    color: "var(--text-primary)",
    marginBottom: 24,
  },
  heroTitleGold: { color: "var(--gold)" },
  heroSubtitle: {
    color: "var(--text-secondary)",
    fontSize: 17,
    maxWidth: 460,
    lineHeight: 1.7,
    marginBottom: 40,
  },
  heroBtns: { display: "flex", gap: 16, flexWrap: "wrap" },
  heroBtn: { textDecoration: "none", display: "inline-block" },
  stats: {
    display: "flex",
    gap: 48,
    marginTop: 64,
    paddingTop: 40,
    borderTop: "1px solid var(--border)",
    flexWrap: "wrap",
  },
  statItem: { display: "flex", flexDirection: "column", gap: 4 },
  statValue: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--gold)",
  },
  statLabel: { fontSize: 13, color: "var(--text-secondary)" },
  featured: { padding: "96px 0" },
  sectionHeader: { marginBottom: 48 },
  sectionEyebrow: {
    color: "var(--gold)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 36,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
  skeletonCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius-lg)",
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    color: "var(--text-primary)",
    marginBottom: 8,
  },
  emptyText: { color: "var(--text-secondary)", fontSize: 14 },
  categories: {
    padding: "0 0 80px",
  },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 16,
  },
  catItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: "24px 16px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    textDecoration: "none",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  catIcon: { fontSize: 28 },
  catLabel: {
    color: "var(--text-secondary)",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.3,
  },
};

export default Home;