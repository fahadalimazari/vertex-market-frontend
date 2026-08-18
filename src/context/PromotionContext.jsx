import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { promotionService } from '../services/promotionService';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

export const PromotionContext = createContext(null);

export const PromotionProvider = ({ children }) => {
  const { generateNotification } = useNotifications();

  // Initial State loaded from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem('vertex_promotions_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to parse promotions from localStorage', err);
    }
    return {
      collectedVouchers: [],
      activeMarketplaceCoupon: null,
      activeSellerCoupon: null,
    };
  };

  const [localState, setLocalState] = useState(loadInitialState);

  // Sync to localStorage whenever localState changes
  useEffect(() => {
    localStorage.setItem('vertex_promotions_v1', JSON.stringify(localState));
  }, [localState]);

  // Global Engine State
  const [flashSales, setFlashSales] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [bundleOffers, setBundleOffers] = useState([]);
  const [freeShippingCampaigns, setFreeShippingCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [fetchedFlashSales, fetchedVouchers, fetchedBundles, fetchedShipping] = await Promise.all([
          promotionService.getActiveFlashSales(),
          promotionService.getAllVouchers(),
          promotionService.getBundleOffers(),
          promotionService.getFreeShippingCampaigns()
        ]);

        setFlashSales(fetchedFlashSales);
        setVouchers(fetchedVouchers);
        setBundleOffers(fetchedBundles);
        setFreeShippingCampaigns(fetchedShipping);
      } catch (err) {
        console.error('Failed to fetch promotion data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // VOUCHER LOGIC
  const collectVoucher = (voucher) => {
    setLocalState(prev => {
      if (prev.collectedVouchers.find(v => v.id === voucher.id)) {
        toast.error('You have already collected this voucher!');
        return prev;
      }
      toast.success('Voucher collected successfully!');
      generateNotification('Voucher Collected', `You saved a new voucher: ${voucher.title}`, 'promotions', 'medium');
      return {
        ...prev,
        collectedVouchers: [...prev.collectedVouchers, voucher]
      };
    });
  };

  const removeVoucher = (voucherId) => {
    setLocalState(prev => ({
      ...prev,
      collectedVouchers: prev.collectedVouchers.filter(v => v.id !== voucherId)
    }));
    toast('Voucher removed from wallet');
  };

  // COUPON VALIDATION & APPLICATION LOGIC
  const applyCouponCode = async (code, cartItems, subtotal) => {
    setIsLoading(true);
    try {
      const validCoupon = await promotionService.validateCoupon(code, cartItems, subtotal);
      
      setLocalState(prev => {
        // Stacking Logic: Max 1 Marketplace + 1 Seller Coupon
        if (validCoupon.type === 'marketplace' || validCoupon.type === 'category' || validCoupon.type === 'brand') {
          if (prev.activeMarketplaceCoupon && !validCoupon.stackable) {
            toast.error('This coupon cannot be combined with existing marketplace discounts.');
            return prev;
          }
          toast.success(`Marketplace Coupon Applied!`);
          generateNotification('Coupon Applied', `Discount code ${code} activated.`, 'promotions', 'low');
          return { ...prev, activeMarketplaceCoupon: validCoupon };
        } else if (validCoupon.type === 'seller') {
          toast.success(`Seller Coupon Applied!`);
          generateNotification('Coupon Applied', `Seller discount code ${code} activated.`, 'promotions', 'low');
          return { ...prev, activeSellerCoupon: validCoupon };
        } else {
           // Fallback for edge cases
           toast.success(`Coupon Applied!`);
           return { ...prev, activeMarketplaceCoupon: validCoupon };
        }
      });
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeActiveCoupon = (type) => {
    setLocalState(prev => {
      if (type === 'marketplace') return { ...prev, activeMarketplaceCoupon: null };
      if (type === 'seller') return { ...prev, activeSellerCoupon: null };
      return prev;
    });
    toast('Coupon removed.');
  };

  const clearAllCoupons = () => {
    setLocalState(prev => ({ ...prev, activeMarketplaceCoupon: null, activeSellerCoupon: null }));
  };

  // CALCULATION LOGIC
  const calculateDiscounts = useCallback((subtotal, eligibleMarketplaceSubtotal, eligibleSellerSubtotal) => {
    let marketplaceDiscount = 0;
    let sellerDiscount = 0;

    if (localState.activeMarketplaceCoupon) {
      marketplaceDiscount = promotionService.calculateDiscount(
        localState.activeMarketplaceCoupon, 
        subtotal, 
        eligibleMarketplaceSubtotal || subtotal
      );
    }

    if (localState.activeSellerCoupon) {
      sellerDiscount = promotionService.calculateDiscount(
        localState.activeSellerCoupon, 
        subtotal, 
        eligibleSellerSubtotal || subtotal
      );
    }

    return {
      marketplaceDiscount,
      sellerDiscount,
      totalDiscount: marketplaceDiscount + sellerDiscount
    };
  }, [localState.activeMarketplaceCoupon, localState.activeSellerCoupon]);


  const value = {
    // Global State
    flashSales,
    vouchers,
    bundleOffers,
    freeShippingCampaigns,
    isLoading,
    
    // Local State
    collectedVouchers: localState.collectedVouchers,
    activeMarketplaceCoupon: localState.activeMarketplaceCoupon,
    activeSellerCoupon: localState.activeSellerCoupon,

    // Methods
    collectVoucher,
    removeVoucher,
    applyCouponCode,
    removeActiveCoupon,
    clearAllCoupons,
    calculateDiscounts
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};
