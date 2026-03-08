import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect non-admin users away from admin routes
export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
