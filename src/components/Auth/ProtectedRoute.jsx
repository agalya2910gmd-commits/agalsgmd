// components/Auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  requireSeller = false,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user, loading, isSeller, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #333",
              borderTopColor: "#d4a853",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 16,
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          Loading...
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Store the intended destination for redirect after login
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Check if seller access is required
  if (requireSeller && !isSeller) {
    // Redirect to home page for non-seller users
    return <Navigate to="/" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    // Redirect to home page for non-admin users
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
