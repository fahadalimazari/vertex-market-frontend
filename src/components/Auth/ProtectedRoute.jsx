import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLoader } from 'react-icons/fi';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Full page skeleton loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="h-10 w-10 text-[#ff6a00] animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  // Check authentication status
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role authorization (Role-ready architecture)
  const currentRole = user?.role || 'User';
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // If unauthorized, redirect to their role's dashboard
    if (currentRole === 'Seller') return <Navigate to="/seller/dashboard" replace />;
    if (currentRole === 'Admin' || currentRole === 'Super Admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentRole === 'Manager') return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default ProtectedRoute;
