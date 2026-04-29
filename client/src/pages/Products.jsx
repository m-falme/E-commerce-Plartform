import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import API from "../services/api";

// useSearchParams reads/writes URL query params like ?category=Electronics
// This means the filter is shareable — copy the URL and it keeps the filter.

function Products() {
  const [products, setProducts]     = useState([]);   // All products from API
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams]              = useSearchParams();

  // On mount: check if URL has ?category=... (from homepage category links)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, []);

  // Fetch all products once on mount
  useEffect(() => {
    API.get("/products/")
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // useMemo re-calculates only when products, search, or category changes.
  // Without useMemo it would recalculate on EVERY render — wasteful.
  // This is a performance optimization called memoization.
  const filtered = useMemo(() => {
    return products.filter(p => {
      // Check category filter
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;

      // Check search — case-insensitive match on name or description
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory]);

  // Build category list from actual products (no hardcoding)
  // Set removes duplicates, spread converts back to array
  const categories = ["All", ...new Set(
    products.map(p => p.category).filter(Boolean)
  )];

  return (
    <div className="page-enter">
      <div className="container" style={{ padding: "48px 24px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>◆ Our Collection</p>
            <h1 style={styles.title}>All Products</h1>
          </div>
          <p style={styles.count}>
            {loading ? "Loading..." : `${filtered.length} items`}
          </p>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>⌕</span>
          <input
            className="input"
            style={styles.searchInput}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              style={styles.clearBtn}
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* ── CATEGORY FILTERS ── */}
        {!loading && categories.length > 1 && (
          <div style={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                style={{
                  ...styles.filterBtn,
                  ...(activeCategory === cat ? styles.filterBtnActive : {}),
                }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        {loading ? (
          <div style={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={styles.skeletonCard}>
                <div className="skeleton" style={{ height: 240 }} />
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="skeleton" style={{ height: 20, width: "70%" }} />
                  <div className="skeleton" style={{ height: 14, width: "90%" }} />
                  <div className="skeleton" style={{ height: 36, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
            <h3 style={styles.emptyTitle}>No products found</h3>
            <p style={styles.emptyText}>
              Try a different search term or category.
            </p>
            <button
              className="btn-outline"
              style={{ marginTop: 20 }}
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 16,
  },
  eyebrow: {
    color: "var(--gold)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 40,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  count: {
    color: "var(--text-muted)",
    fontSize: 14,
    paddingBottom: 8,
  },
  searchWrap: {
    position: "relative",
    marginBottom: 24,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
    fontSize: 20,
    pointerEvents: "none",
  },
  searchInput: {
    paddingLeft: 48,
    paddingRight: 40,
  },
  clearBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: 14,
    padding: 4,
  },
  filters: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 32,
  },
  filterBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    padding: "8px 18px",
    borderRadius: 20,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
    fontWeight: 500,
  },
  filterBtnActive: {
    background: "var(--gold-dim)",
    borderColor: "var(--gold)",
    color: "var(--gold)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 24,
  },
  skeletonCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
  },
  empty: {
    textAlign: "center",
    padding: "80px 24px",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius-lg)",
  },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    color: "var(--text-primary)",
    marginBottom: 8,
  },
  emptyText: { color: "var(--text-secondary)", fontSize: 14 },
};

export default Products;