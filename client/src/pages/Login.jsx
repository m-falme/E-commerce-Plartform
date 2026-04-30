import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // res.data is what Flask returned:
      // { access_token: "...", user: { id, email, username }, message: "..." }
      login(res.data.access_token, res.data.user);
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>◆ M&M </div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn-primary"
            style={styles.submitBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p style={styles.switchText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "40px 36px",
  },
  header: { textAlign: "center", marginBottom: 32 },
  logo: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--gold)",
    letterSpacing: 3,
    marginBottom: 24,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 8,
  },
  subtitle: { color: "var(--text-secondary)", fontSize: 14 },
  error: {
    background: "rgba(220,50,50,0.1)",
    border: "1px solid rgba(220,50,50,0.3)",
    color: "#ff6b6b",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    marginBottom: 20,
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" },
  submitBtn: { width: "100%", padding: "15px", fontSize: 15, marginTop: 4 },
  switchText: { textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" },
  switchLink: { color: "var(--gold)", textDecoration: "none", fontWeight: 500 },
};

export default Login;