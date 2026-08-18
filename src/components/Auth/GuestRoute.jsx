import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLoader } from 'react-icons/fi';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="h-10 w-10 text-[#ff6a00] animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'Seller') {
      const status = user?.sellerProfile?.status;
      if (status === 'Approved') return <Navigate to="/seller/dashboard" replace />;
      return <Navigate to="/seller/status" replace />;
    }
    if (user?.role === 'Admin' || user?.role === 'Super Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default GuestRoute;
