import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { checkoutService } from '../services/checkoutService';
import { useCart } from './CartContext';
import { useNotifications } from './NotificationContext';
import { usePromotions } from '../hooks/usePromotions';
import toast from 'react-hot-toast';

export const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const { cartItems, clearCart } = useCart();
  const { generateNotification } = useNotifications();
  const { activeMarketplaceCoupon, activeSellerCoupon, calculateDiscounts, clearAllCoupons } = usePromotions();

  // Load initial state from LocalStorage if exists
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem('vertex_checkout_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse checkout local storage', e);
    }
    return {
      currentStep: 1,
      selectedAddressId: null,
      selectedDeliveryId: 'standard',
      selectedPaymentId: null,
      paymentDetails: {}
    };
  };

  const [checkoutState, setCheckoutState] = useState(loadInitialState);
  const [addresses, setAddresses] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vertex_checkout_v1', JSON.stringify(checkoutState));
  }, [checkoutState]);

  // Load options from service
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [fetchedAddresses, fetchedDelivery, fetchedPayment] = await Promise.all([
          checkoutService.getAddresses(),
          checkoutService.getDeliveryMethods(),
          checkoutService.getPaymentMethods()
        ]);
        setAddresses(fetchedAddresses);
        setDeliveryMethods(fetchedDelivery);
        setPaymentMethods(fetchedPayment);

        // Verify or auto-select default address
        if (checkoutState.selectedAddressId) {
          const exists = fetchedAddresses.find(a => String(a.id) === String(checkoutState.selectedAddressId) || String(a._id) === String(checkoutState.selectedAddressId));
          if (!exists) {
            const defaultAddr = fetchedAddresses.find(a => a.isDefault);
            setCheckoutState(prev => ({ ...prev, selectedAddressId: defaultAddr ? defaultAddr.id : null }));
          }
        } else {
          const defaultAddr = fetchedAddresses.find(a => a.isDefault);
          if (defaultAddr) {
            setCheckoutState(prev => ({ ...prev, selectedAddressId: defaultAddr.id }));
          }
        }
      } catch (err) {
        console.error('Failed to load checkout options', err);
      }
    };
    fetchOptions();
  }, []);

  // Setters
  const setCurrentStep = (step) => setCheckoutState(prev => ({ ...prev, currentStep: step }));
  const setSelectedAddressId = (id) => setCheckoutState(prev => ({ ...prev, selectedAddressId: id }));
  const setSelectedDeliveryId = (id) => setCheckoutState(prev => ({ ...prev, selectedDeliveryId: id }));
  const setSelectedPaymentId = (id) => setCheckoutState(prev => ({ ...prev, selectedPaymentId: id }));
  const setPaymentDetails = (details) => setCheckoutState(prev => ({ ...prev, paymentDetails: details }));
  
  // Note: applyCoupon and removeCoupon are now handled by PromotionContext globally.
  // We remove them from checkoutState to avoid duplication.

  // Address Management
  const addAddress = async (address) => {
    setIsLoading(true);
    try {
      const updated = await checkoutService.addAddress(address);
      setAddresses(updated);
      toast.success('Address added successfully');
      const newAddr = updated[updated.length - 1];
      setSelectedAddressId(newAddr.id);
    } catch(err) {
      toast.error(err.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (id, updates) => {
    setIsLoading(true);
    try {
      const updated = await checkoutService.updateAddress(id, updates);
      setAddresses(updated);
      toast.success('Address updated successfully');
    } catch(err) {
      toast.error('Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    setIsLoading(true);
    try {
      const updated = await checkoutService.deleteAddress(id);
      setAddresses(updated);
      toast.success('Address deleted successfully');
      if (checkoutState.selectedAddressId === id) {
        setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
      }
    } catch(err) {
      toast.error('Failed to delete address');
    } finally {
      setIsLoading(false);
    }
  };

  // Computed Totals (Pulled from Backend via CartContext)
  const { cartSummary } = useCart();

  const subtotal = cartSummary?.itemsTotal || 0;
  const discount = cartSummary?.discountTotal || 0;
  
  const deliveryFee = useMemo(() => {
    const method = deliveryMethods.find(m => m.id === checkoutState.selectedDeliveryId);
    return method ? method.price : (cartSummary?.shippingFee || 0);
  }, [checkoutState.selectedDeliveryId, deliveryMethods, cartSummary]);

  const tax = cartSummary?.tax || 0;
  // cartSummary.grandTotal already includes cartSummary.shippingFee, so we subtract it before adding the selected deliveryFee
  const total = (cartSummary?.grandTotal || 0) - (cartSummary?.shippingFee || 0) + deliveryFee; 

  // Place Order
  const placeOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fullAddress = addresses.find(a => String(a.id) === String(checkoutState.selectedAddressId) || String(a._id) === String(checkoutState.selectedAddressId));
      
      if (!fullAddress) {
        setSelectedAddressId(null);
        setCurrentStep(1);
        throw new Error('Please select a valid shipping address.');
      }

      const orderPayload = {
        items: cartItems,
        addressId: checkoutState.selectedAddressId,
        address: fullAddress, // Pass full address object for backend
        deliveryId: checkoutState.selectedDeliveryId,
        paymentId: checkoutState.selectedPaymentId,
        paymentDetails: checkoutState.paymentDetails,
        appliedCoupons: [activeMarketplaceCoupon, activeSellerCoupon].filter(Boolean),
        totals: {
          subtotal,
          discount,
          deliveryFee,
          tax,
          total
        }
      };

      const finalOrder = await checkoutService.placeOrder(orderPayload);
      
      toast.success('Order Placed Successfully!');
      generateNotification(
        'Order Placed',
        `Your order #${finalOrder.orderId} has been placed successfully.`,
        'orders',
        'high',
        `/account/orders/${finalOrder.orderId}`
      );
      
      // Reset checkout state
      setCheckoutState({
        currentStep: 1,
        selectedAddressId: checkoutState.selectedAddressId,
        selectedDeliveryId: 'standard',
        selectedPaymentId: null,
        paymentDetails: {}
      });
      clearCart();
      clearAllCoupons();
      setIsLoading(false);
      return finalOrder;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const value = {
    ...checkoutState,
    setCurrentStep,
    setSelectedAddressId,
    setSelectedDeliveryId,
    setSelectedPaymentId,
    setPaymentDetails,
    addresses,
    deliveryMethods,
    paymentMethods,
    addAddress,
    updateAddress,
    deleteAddress,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    cartItems,
    placeOrder,
    isLoading,
    error
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
