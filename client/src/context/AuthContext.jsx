import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data)) 
        .catch(err => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
      setLoading(false);
    }
  }, []);

  // login() is called after a successful /auth/login API call.
  // It saves the token and stores the user object in state.
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // logout() removes the token and clears the user from state.
  // Any component watching 'user' will instantly re-render to show
  // the logged-out state — that's the beauty of React state.
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // getToken() is a helper used when making authenticated API calls.
  const getToken = () => localStorage.getItem("token");

  // The value object is what components receive when they call useAuth().
  // We expose: the user object, login function, logout function, loading state.
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getToken }}>
      {/* Only render children after we've checked for a saved token.
          This prevents a flash of "logged out" state on page load. */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// useAuth is a custom hook — a shortcut so components don't have to
// write useContext(AuthContext) every time. They just write useAuth().
// Custom hooks always start with "use" by convention.
export function useAuth() {
  return useContext(AuthContext);
}