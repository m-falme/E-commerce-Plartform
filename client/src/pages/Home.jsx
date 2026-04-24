import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn, logout } from "../services/auth";

function Home() {
  const navigate = useNavigate(); // 👈 MUST BE HERE

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]); // 👈 add dependency

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // 👈 important fix
  };

  return (
    <div>
      <h1>Welcome to E-commerce App</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Home;