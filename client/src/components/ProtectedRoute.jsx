import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps routes that require the user to be logged in.
 * Redirects to /login if no token, preserving the intended destination.
 */
export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Memeriksa sesi...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
