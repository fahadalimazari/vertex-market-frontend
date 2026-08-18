import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiClock, FiAlertCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';

const SellerStatus = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const status = user?.sellerProfile?.status;

  useEffect(() => {
    if (loading) return;
    
    // If not a seller, or approved, redirect away
    if (!user || user.role !== 'Seller') {
      navigate('/account', { replace: true });
    } else if (status === 'Approved') {
      navigate('/seller/dashboard', { replace: true });
    }
  }, [user, status, navigate, loading]);

  const getStatusContent = () => {
    switch (status) {
      case 'Pending':
        return {
          icon: <FiClock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />,
          title: 'Waiting for Approval',
          message: 'Your seller application is currently under review by our team. This usually takes 24-48 hours. We will notify you once a decision is made.'
        };
      case 'Rejected':
        return {
          icon: <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
          title: 'Application Rejected',
          message: user.sellerProfile?.rejectionReason || 'Unfortunately, your seller application did not meet our criteria at this time.'
        };
      case 'Resubmission Required':
        return {
          icon: <FiRefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
          title: 'Update & Resubmit Application',
          message: user.sellerProfile?.resubmissionComments || 'We need a bit more information. Please update your application and resubmit.'
        };
      case 'Suspended':
        return {
          icon: <FiAlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />,
          title: 'Account Suspended',
          message: 'Your seller account has been suspended due to policy violations. Please contact support for more information.'
        };
      default:
        return {
          icon: <FiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: 'Loading Status...',
          message: 'Please wait while we verify your account status.'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        {content.icon}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-600 mb-8">{content.message}</p>
        
        {status === 'Resubmission Required' && (
          <button 
            onClick={() => navigate('/seller/register')}
            className="w-full py-3 px-4 bg-[#ff6a00] hover:bg-[#e05e00] text-white rounded-xl font-semibold transition-colors"
          >
            Update Application
          </button>
        )}
        
        <button 
          onClick={() => navigate('/')}
          className={`w-full py-3 px-4 ${status === 'Resubmission Required' ? 'mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-xl font-semibold transition-colors`}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default SellerStatus;
