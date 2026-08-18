import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const SellerManagementContext = createContext(null);
const SELLERS_KEY = 'vertex_admin_sellers_list_v1';

export const useSellerManagement = () => {
  const context = useContext(SellerManagementContext);
  if (!context) {
    throw new Error('useSellerManagement must be used within a SellerManagementProvider');
  }
  return context;
};

export const SellerManagementProvider = ({ children }) => {
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    const data = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
    if (data) {
      const user = JSON.parse(data);
      return user.token;
    }
    return null;
  };

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/superadmin/sellers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        // Map backend schema to rich frontend expectation
        const formatted = data.data.map(seller => ({
          id: seller._id,
          storeName: seller.storeName,
          storeSlug: seller.storeSlug,
          storeLogo: seller.storeLogo,
          owner: seller.ownerName || 'Unknown',
          ownerAvatar: seller.ownerAvatar || (seller.user && seller.user.avatar),
          email: seller.ownerEmail || 'N/A',
          phone: seller.contactPhone || (seller.userInfo && seller.userInfo.phone) || 'N/A',
          status: seller.status,
          businessType: seller.businessType || 'Individual',
          businessCategory: seller.businessCategory || 'General Commerce',
          expectedProducts: seller.expectedProducts || '10-50 Products',
          monthlySales: seller.monthlySales || 'Rs. 100,000 - 500,000',
          nationalId: seller.nationalId || 'N/A',
          ntn: seller.businessRegistrationNumber || 'N/A',
          taxNumber: seller.taxRegistrationNumber || 'N/A',
          address: seller.proofOfAddress || 'N/A',
          bankDetails: seller.bankDetails || {},
          kycDocuments: seller.kycDocuments || {},
          earnings: seller.revenue || 0,
          productsCount: seller.productsCount || 0,
          followersCount: seller.followersCount || 0,
          ordersCount: seller.ordersCount || 0,
          completedOrdersCount: seller.completedOrdersCount || 0,
          rating: seller.storeRating || 0,
          badges: seller.badges || [],
          createdAt: seller.createdAt,
          documentUrl: seller.businessCertificate || (seller.kycDocuments && seller.kycDocuments.businessCertificate) || ''
        }));
        setSellers(formatted);
      }

      // Also fetch stats
      const statsRes = await fetch('https://vertex-market-backend.vercel.app/api/v1/superadmin/sellers/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Failed to load sellers or stats', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const updateStatus = async (id, status, reason = '') => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`https://vertex-market-backend.vercel.app/api/v1/superadmin/sellers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason, comments: reason })
      });
      
      const data = await res.json();
      if (data.success) {
        setSellers(prev => prev.map(s => 
          s.id === id ? { ...s, status: data.data.status } : s
        ));
        toast.success(`Seller application ${status.toLowerCase()}`);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Error updating status');
    }
  };

  const approveSeller = useCallback((id) => {
    updateStatus(id, 'Approved');
  }, []);

  const rejectSeller = useCallback((id, reason = 'Did not meet criteria') => {
    updateStatus(id, 'Rejected', reason);
  }, []);

  const suspendSeller = useCallback((id) => {
    updateStatus(id, 'Suspended');
  }, []);

  const activateSeller = useCallback((id) => {
    updateStatus(id, 'Approved');
  }, []);

  return (
    <SellerManagementContext.Provider value={{
      sellers,
      stats,
      approveSeller,
      rejectSeller,
      suspendSeller,
      activateSeller
    }}>
      {children}
    </SellerManagementContext.Provider>
  );
};
