import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";


export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // current URL path like "/products"
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Listen to scroll events and update state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    // Cleanup: remove the listener when the component unmounts (unloads)
    // Without this, old listeners pile up and cause memory leaks
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper: is this link the current page?
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: "1.25rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      // Backdrop blur creates the frosted glass effect when scrolled
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #2a2a2a" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>

      {/* LOGO */}
      <Link to="/" style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.6rem",
        fontWeight: 300,
        letterSpacing: "0.15em",
        color: "var(--white)",
      }}>
        M&M<span style={{ color: "var(--gold)" }}></span>
      </Link>

      {/* NAV LINKS — desktop */}
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <Link to="/" style={{
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: isActive("/") ? "var(--gold)" : "var(--muted)",
          transition: "var(--transition)",
          fontWeight: 400,
        }}>Home</Link>

        {isLoggedIn && (
          <Link to="/products" style={{
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isActive("/products") ? "var(--gold)" : "var(--muted)",
            transition: "var(--transition)",
            fontWeight: 400,
          }}>Shop</Link>
        )}

        {/* AUTH LINKS */}
        {!isLoggedIn ? (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login" className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-gold" style={{ padding: "0.5rem 1.5rem", fontSize: "0.8rem" }}>
              Register
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* Welcome message */}
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.05em" }}>
              {user?.username}
            </span>

            {/* Cart icon with badge */}
            <Link to="/cart" style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <svg width="22" height="22" fill="none" stroke={isActive("/cart") ? "var(--gold)" : "var(--muted)"} strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="badge" style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "0.6rem" }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Logout */}
            <button onClick={handleLogout} className="btn btn-outline" style={{
              padding: "0.5rem 1.2rem",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}