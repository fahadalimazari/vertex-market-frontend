import { useEffect } from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { useNavigate } from 'react-router-dom';
import CheckoutProgress from '../../components/Checkout/CheckoutProgress';
import ShippingAddress from '../../components/Checkout/ShippingAddress';
import DeliveryMethod from '../../components/Checkout/DeliveryMethod';
import PaymentMethods from '../../components/Checkout/PaymentMethods';
import OrderReview from '../../components/Checkout/OrderReview';
import CheckoutSidebar from '../../components/Checkout/CheckoutSidebar';

const Checkout = () => {
  const { cartItems, currentStep, isLoading } = useCheckout();
  const navigate = useNavigate();

  useEffect(() => {
    // If cart is empty, redirect back to cart
    if (!isLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, isLoading, navigate]);

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ShippingAddress />;
      case 2: return <DeliveryMethod />;
      case 3: return <PaymentMethods />;
      case 4: return <OrderReview />;
      default: return <ShippingAddress />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Secure Checkout</h1>
        
        <CheckoutProgress />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Main Checkout Area */}
          <div className="flex-1">
            {renderStep()}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[400px]">
            <CheckoutSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
