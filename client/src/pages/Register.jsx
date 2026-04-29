import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // One state per form field
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");   // Error message to display

  const handleRegister = async () => {
    // Client-side validation — check before sending to server
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error

    try {
      // Step 1: Register the user
      await API.post("/auth/register", { username, email, password });

      // Step 2: Immediately log them in
      const loginRes = await API.post("/auth/login", { email, password });

      // Step 3: Save to context (which saves token to localStorage)
      login(loginRes.data.access_token, loginRes.data.user);

      // Step 4: Redirect to home
      navigate("/");

    } catch (err) {
      // err.response.data.message is the message from your Flask API
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      // finally always runs — loading stops whether success or fail
      setLoading(false);
    }
  };

  // Allow form submission by pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>◆ LUXE</div>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Join us for an exclusive experience</p>
        </div>

        {/* Error message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              className="input"
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input
              className="input"
              type="password"
              placeholder="Same password again"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn-primary"
            style={styles.submitBtn}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.switchLink}>Sign in</Link>
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
    maxWidth: 420,
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
  label: { fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: 0.3 },
  submitBtn: { width: "100%", padding: "15px", fontSize: 15, marginTop: 4 },
  switchText: { textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" },
  switchLink: { color: "var(--gold)", textDecoration: "none", fontWeight: 500 },
};

export default Register;