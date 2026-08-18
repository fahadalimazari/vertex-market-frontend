import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CouponContext = createContext(null);
const ADMIN_COUPON_KEY = 'vertex_admin_coupons_v1';

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState(() => {
    try {
      const data = localStorage.getItem(ADMIN_COUPON_KEY);
      const defaultCoupons = [
        { code: 'VERTEX50', type: 'percentage', discount: 50, startDate: '2026-07-01', endDate: '2026-08-01', usageLimit: 100, status: 'Active' },
        { code: 'FREESHIP', type: 'free_shipping', discount: 0, startDate: '2026-07-01', endDate: '2026-12-01', usageLimit: 500, status: 'Active' }
      ];
      return data ? JSON.parse(data) : defaultCoupons;
    } catch (e) {
      console.error('Failed to load admin coupons', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ADMIN_COUPON_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback((coupon) => {
    setCoupons(prev => [{ ...coupon, status: 'Active' }, ...prev]);
    toast.success(`Coupon ${coupon.code} created successfully`);
  }, []);

  const deleteCoupon = useCallback((code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    toast.success(`Coupon ${code} deleted`);
  }, []);

  const toggleCouponStatus = useCallback((code) => {
    setCoupons(prev => prev.map(c => 
      c.code === code ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
    ));
    toast.success(`Coupon ${code} status updated`);
  }, []);

  return (
    <CouponContext.Provider value={{
      coupons,
      addCoupon,
      deleteCoupon,
      toggleCouponStatus
    }}>
      {children}
    </CouponContext.Provider>
  );
};
