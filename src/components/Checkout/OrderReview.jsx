import { useState } from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { FiEdit2 } from 'react-icons/fi';
import PlaceOrderButton from './PlaceOrderButton';

const OrderReview = () => {
  const { 
    addresses, 
    selectedAddressId, 
    deliveryMethods, 
    selectedDeliveryId, 
    paymentMethods, 
    selectedPaymentId, 
    setCurrentStep,
    cartItems
  } = useCheckout();

  const [termsAccepted, setTermsAccepted] = useState(false);

  const address = addresses.find(a => a.id === selectedAddressId);
  const delivery = deliveryMethods.find(m => m.id === selectedDeliveryId);
  const payment = paymentMethods.find(p => p.id === selectedPaymentId);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review Order</h2>

      <div className="flex flex-col gap-6">
        {/* Items Review */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Items ({cartItems.length})</h3>
            <button onClick={() => window.location.href = '/cart'} className="text-sm font-semibold text-[#ff6a00] flex items-center gap-1">
              <FiEdit2 /> Edit Cart
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address Review */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Shipping Address</h3>
            <button onClick={() => setCurrentStep(1)} className="text-sm font-semibold text-[#ff6a00] flex items-center gap-1">
              <FiEdit2 /> Change
            </button>
          </div>
          {address ? (
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-900">{address.fullName}</p>
              <p>{address.addressLine1}</p>
              <p>{address.city}, {address.state} {address.zip}</p>
              <p>{address.phone}</p>
            </div>
          ) : (
            <p className="text-red-500 text-sm">No address selected</p>
          )}
        </div>

        {/* Delivery & Payment Review */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Delivery Method</h3>
              <button onClick={() => setCurrentStep(2)} className="text-sm font-semibold text-[#ff6a00] flex items-center gap-1">
                <FiEdit2 /> Change
              </button>
            </div>
            {delivery ? (
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{delivery.name}</p>
                <p>Est. Delivery: {delivery.estimatedDays}</p>
              </div>
            ) : (
              <p className="text-red-500 text-sm">No delivery method selected</p>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Payment Method</h3>
              <button onClick={() => setCurrentStep(3)} className="text-sm font-semibold text-[#ff6a00] flex items-center gap-1">
                <FiEdit2 /> Change
              </button>
            </div>
            {payment ? (
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{payment.name}</p>
              </div>
            ) : (
              <p className="text-red-500 text-sm">No payment method selected</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="mt-4 flex items-start gap-2">
          <input 
            type="checkbox" 
            id="terms" 
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 text-[#ff6a00] rounded border-gray-300 focus:ring-[#ff6a00]"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the <a href="#" className="text-[#ff6a00] hover:underline">Terms & Conditions</a>, <a href="#" className="text-[#ff6a00] hover:underline">Privacy Policy</a>, and <a href="#" className="text-[#ff6a00] hover:underline">Return Policy</a>.
          </label>
        </div>

        <div className="mt-6">
          <PlaceOrderButton termsAccepted={termsAccepted} />
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
