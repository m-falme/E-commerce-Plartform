import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Home     from "./pages/Home";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart     from "./pages/Cart";

export default function App() {
  return (
    // AuthProvider wraps everything — any component can access auth state.
    // CartProvider is inside AuthProvider because Cart needs auth (for token).
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Navbar appears on every page */}
          <Navbar />

          <Routes>
            {/* Public routes — anyone can access */}
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />

            {/* Protected route — must be logged in */}
            {/* ProtectedRoute wraps Cart so it redirects to /login if not logged in */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}