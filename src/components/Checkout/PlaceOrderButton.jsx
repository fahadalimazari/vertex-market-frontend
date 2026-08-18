import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';
import { FiLock } from 'react-icons/fi';

const PlaceOrderButton = ({ termsAccepted }) => {
  const navigate = useNavigate();
  const { 
    placeOrder, 
    isLoading, 
    selectedAddressId, 
    selectedDeliveryId, 
    selectedPaymentId,
    cartItems
  } = useCheckout();

  const isReady = selectedAddressId && selectedDeliveryId && selectedPaymentId && cartItems.length > 0 && termsAccepted;

  const handlePlaceOrder = async () => {
    if (!isReady) return;
    
    try {
      const order = await placeOrder();
      // Redirect to success page
      navigate(`/order-success?orderId=${order.orderId}`);
    } catch (error) {
      // If error occurs, it could be payment failure, redirect to order failed page
      navigate('/order-failed');
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePlaceOrder}
        disabled={!isReady || isLoading}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          isReady && !isLoading
            ? 'bg-[#ff6a00] text-white hover:bg-[#e65c00] hover:shadow-lg hover:shadow-[#ff6a00]/20'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Processing Order...
          </span>
        ) : (
          <>
            <FiLock /> Place Order
          </>
        )}
      </button>
      <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
        <FiLock className="text-gray-400" /> Secure encrypted checkout
      </p>
    </div>
  );
};

export default PlaceOrderButton;
