import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
        console.log("Sending login request...");

        const res = await API.post("/auth/login", {
        email,
        password,
        });

        console.log("Response:", res.data);

        localStorage.setItem("token", res.data.access_token);

        alert("Login successful");

        navigate("/");

    } catch (err) {
        console.log("LOGIN ERROR:", err.response?.data || err.message);
        alert("Login failed");
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;