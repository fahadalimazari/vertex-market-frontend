import { useCheckout } from '../../hooks/useCheckout';
import { FiTruck, FiClock, FiZap, FiCheckCircle } from 'react-icons/fi';

const DeliveryMethod = () => {
  const { deliveryMethods, selectedDeliveryId, setSelectedDeliveryId, setCurrentStep } = useCheckout();

  const getIcon = (id) => {
    switch (id) {
      case 'standard': return <FiTruck className="text-gray-500 text-2xl" />;
      case 'express': return <FiZap className="text-blue-500 text-2xl" />;
      case 'sameday': return <FiClock className="text-[#ff6a00] text-2xl" />;
      default: return <FiTruck className="text-gray-500 text-2xl" />;
    }
  };

  const handleContinue = () => {
    if (selectedDeliveryId) {
      setCurrentStep(3); // Go to Payment step
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Method</h2>

      <div className="flex flex-col gap-4">
        {deliveryMethods.map((method) => {
          const isSelected = selectedDeliveryId === method.id;
          return (
            <div 
              key={method.id}
              onClick={() => setSelectedDeliveryId(method.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                isSelected ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  {getIcon(method.id)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-500">Estimated Delivery: <span className="font-semibold text-gray-700">{method.estimatedDays}</span></p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-gray-900 text-lg">Rs. {method.price}</span>
                {isSelected && (
                  <FiCheckCircle className="text-[#ff6a00] text-xl" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Back to Address
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedDeliveryId}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-colors ${
            selectedDeliveryId 
              ? 'bg-[#ff6a00] hover:bg-[#e65c00]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default DeliveryMethod;
