import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect unauthenticated users to login
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
