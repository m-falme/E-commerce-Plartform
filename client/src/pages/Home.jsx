import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        padding: "8rem 2rem 4rem",
      }}>
        {/* Background decorative gold circle */}
        <div style={{
          position: "absolute",
          top: "20%", right: "-10%",
          width: "600px", height: "600px",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.08)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          top: "30%", right: "-5%",
          width: "400px", height: "400px",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.12)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: "700px" }}>
            {/* Eyebrow label */}
            <p style={{
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1.5rem",
              animation: "fadeUp 0.6s ease forwards",
            }}>
              New Collection 2025
            </p>

            {/* Main heading */}
            <h1 style={{
              marginBottom: "1.5rem",
              color: "var(--white)",
              animation: "fadeUp 0.6s ease 0.1s forwards",
              opacity: 0,
            }}>
              Curated for the<br />
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Discerning</em> Few
            </h1>

            {/* Gold divider */}
            <div className="divider" style={{ animation: "fadeUp 0.6s ease 0.2s forwards", opacity: 0 }} />

            <p style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: "480px",
              marginBottom: "2.5rem",
              color: "var(--muted)",
              animation: "fadeUp 0.6s ease 0.3s forwards",
              opacity: 0,
            }}>
              Premium goods sourced from around the world. Every item selected with intention, delivered with care.
            </p>

            {/* CTA buttons */}
            <div style={{
              display: "flex", gap: "1rem", flexWrap: "wrap",
              animation: "fadeUp 0.6s ease 0.4s forwards",
              opacity: 0,
            }}>
              {isLoggedIn ? (
                <Link to="/products" className="btn btn-gold">
                  Explore Collection
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-gold">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ─────────────────────────────────────── */}
      <section style={{ padding: "6rem 2rem", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ color: "var(--gold)", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "1rem" }}>
              Why Luxe
            </p>
            <h2>The Standard of Excellence</h2>
          </div>

          {/* Feature cards — CSS Grid for layout */}
          {/* grid-template-columns: repeat(3, 1fr) = 3 equal columns */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }} className="stagger">
            {[
              { icon: "◈", title: "Curated Selection", desc: "Every product handpicked by our team of experts for quality and uniqueness." },
              { icon: "◎", title: "Secure Checkout", desc: "Bank-level encryption on every transaction. Your data stays yours." },
              { icon: "◇", title: "Premium Delivery", desc: "White-glove delivery experience with real-time tracking on every order." },
            ].map((f) => (
              <div key={f.title} className="card fade-up" style={{ padding: "2.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--gold)" }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: "0.75rem", fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section style={{
          padding: "6rem 2rem",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.03))",
        }}>
          <div className="container">
            <p style={{ color: "var(--gold)", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "1rem" }}>
              Join Today
            </p>
            <h2 style={{ marginBottom: "1rem" }}>Begin Your Journey</h2>
            <p style={{ maxWidth: "400px", margin: "0 auto 2.5rem" }}>
              Create an account to access the full collection and exclusive member pricing.
            </p>
            <Link to="/register" className="btn btn-gold" style={{ fontSize: "0.85rem" }}>
              Create Account
            </Link>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        padding: "2rem",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
          © 2025 M&M. All rights reserved.
        </p>
      </footer>
    </div>
  );
}