import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SellerContext = createContext(null);
const SELLER_KEY = 'vertex_seller_v1';

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const { generateNotification } = useNotifications();
  const { user } = useAuth();
  
  const [sellerProfile, setSellerProfile] = useState(() => {
    try {
      const data = localStorage.getItem(SELLER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load seller profile', e);
      return null;
    }
  });

  // Derive isRegisteredSeller directly from AuthContext to avoid async useEffect race conditions
  const isRegisteredSeller = user?.role === 'Seller';

  // Sync sellerProfile when user changes, but we can just use user.sellerProfile directly
  // We'll keep the state just in case it's mutated locally during session
  useEffect(() => {
    if (user && user.role === 'Seller' && user.sellerProfile) {
      setSellerProfile(user.sellerProfile);
    } else if (!user || user.role !== 'Seller') {
      setSellerProfile(null);
    }
  }, [user]);

  const applyAsSeller = useCallback((profileData) => {
    const profile = {
      ...profileData,
      status: 'approved', // auto-approve for frontend simulation
      registeredAt: new Date().toISOString()
    };
    
    setSellerProfile(profile);
    localStorage.setItem(SELLER_KEY, JSON.stringify(profile));

    // Dispatch submission notification
    generateNotification(
      "Seller Application Submitted",
      "Your application to become a registered seller on Vertex Market has been received and is pending Admin review.",
      "security",
      "medium",
      "/"
    );

    toast.success('Seller application submitted successfully!');
  }, [generateNotification]);

  const deactivateSeller = useCallback(() => {
    setSellerProfile(null);
    localStorage.removeItem(SELLER_KEY);
    toast.success('Seller profile deactivated');
  }, []);

  return (
    <SellerContext.Provider value={{
      sellerProfile,
      isRegisteredSeller,
      applyAsSeller,
      deactivateSeller
    }}>
      {children}
    </SellerContext.Provider>
  );
};
