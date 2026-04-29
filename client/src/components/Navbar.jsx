import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

// Link is React Router's <a> tag — it navigates without page reload.
// useNavigate() gives a function to redirect programmatically.
// useLocation() tells you the current URL path (for active link styling).

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // { pathname: "/products", ... }
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper: is this link currently active?
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          {/* ── LOGO ── */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>◆</span>
            LUXE
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div style={styles.links}>
            <Link
              to="/"
              style={{ ...styles.link, ...(isActive("/") ? styles.linkActive : {}) }}
            >
              Home
            </Link>
            <Link
              to="/products"
              style={{ ...styles.link, ...(isActive("/products") ? styles.linkActive : {}) }}
            >
              Shop
            </Link>
          </div>

          {/* ── RIGHT SIDE ACTIONS ── */}
          <div style={styles.actions}>
            {user ? (
              <>
                {/* Greeting */}
                <span style={styles.greeting}>Hi, {user.username}</span>

                {/* Cart icon with live badge */}
                <Link to="/cart" style={styles.cartBtn}>
                  <CartIcon />
                  {/* Only show the badge if cart has items */}
                  {cartCount > 0 && (
                    <span style={styles.badge}>{cartCount}</span>
                  )}
                </Link>

                <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary" style={{ textDecoration: "none", padding: "10px 20px", borderRadius: 6, fontSize: 14, fontWeight: 600, background: "var(--gold)", color: "#0a0a0a" }}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer so page content doesn't hide under the fixed navbar */}
      <div style={{ height: 64 }} />
    </>
  );
}

// Simple SVG cart icon — no icon library needed
function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

// Styles as JavaScript objects — called "CSS-in-JS".
// This keeps styles close to the component that uses them.
// Style properties use camelCase: background-color → backgroundColor
const styles = {
  nav: {
    position: "fixed",        // Stays at top even when scrolling
    top: 0, left: 0, right: 0,
    zIndex: 100,
    background: "rgba(10,10,10,0.85)",
    backdropFilter: "blur(12px)", // Frosted glass effect
    borderBottom: "1px solid var(--border)",
    height: 64,
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--gold)",
    textDecoration: "none",
    letterSpacing: 3,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: { fontSize: 14, opacity: 0.8 },
  links: { display: "flex", gap: 32 },
  link: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.3,
    transition: "color 0.2s",
    padding: "4px 0",
    borderBottom: "2px solid transparent",
  },
  linkActive: {
    color: "var(--text-primary)",
    borderBottomColor: "var(--gold)",
  },
  actions: { display: "flex", alignItems: "center", gap: 16 },
  greeting: {
    color: "var(--text-secondary)",
    fontSize: 13,
  },
  cartBtn: {
    position: "relative",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
    textDecoration: "none",
  },
  badge: {
    position: "absolute",
    top: -8, right: -8,
    background: "var(--gold)",
    color: "#0a0a0a",
    borderRadius: "50%",
    width: 18, height: 18,
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Navbar;