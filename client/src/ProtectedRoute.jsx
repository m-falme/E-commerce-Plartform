import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// children is whatever is inside <ProtectedRoute>...</ProtectedRoute>
// redirect is where to send them if not logged in (default: /login)
function ProtectedRoute({ children, redirect = "/login" }) {
  const { user } = useAuth();

  // If no user in context → they're not logged in → redirect
  // <Navigate> is React Router's way of redirecting programmatically in JSX.
  // replace={true} means the redirect replaces the history entry,
  // so clicking "back" won't loop them back to the protected page.
  if (!user) {
    return <Navigate to={redirect} replace />;
  }

  // User is logged in → render the actual page
  return children;
}

export default ProtectedRoute;