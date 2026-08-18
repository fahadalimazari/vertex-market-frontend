import { useCheckout } from '../../hooks/useCheckout';
import { FiBox, FiCreditCard, FiSmartphone, FiBriefcase, FiCheckCircle } from 'react-icons/fi';
import CardForm from './CardForm';
import JazzCashForm from './JazzCashForm';

const PaymentMethods = () => {
  const { paymentMethods, selectedPaymentId, setSelectedPaymentId, setCurrentStep } = useCheckout();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'FiBox': return <FiBox className="text-[#ff6a00] text-2xl" />;
      case 'FiCreditCard': return <FiCreditCard className="text-blue-500 text-2xl" />;
      case 'FiSmartphone': return <FiSmartphone className="text-red-500 text-2xl" />;
      case 'FiBriefcase': return <FiBriefcase className="text-green-500 text-2xl" />;
      default: return <FiCreditCard className="text-gray-500 text-2xl" />;
    }
  };

  const renderPaymentForm = (methodId) => {
    if (selectedPaymentId !== methodId) return null;

    switch (methodId) {
      case 'card':
        return <CardForm />;
      case 'jazzcash':
      case 'easypaisa':
        return <JazzCashForm />;
      case 'cod':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">
              You can pay in cash to our courier when you receive the goods at your doorstep.
            </p>
          </div>
        );
      case 'bank':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Please transfer the total amount to the following bank account:</p>
            <div className="font-mono bg-white p-3 border border-gray-200 rounded-lg text-sm">
              <p>Bank: <strong>Vertex Bank Ltd.</strong></p>
              <p>Account Title: <strong>Vertex Market</strong></p>
              <p>Account No: <strong>00112233445566</strong></p>
              <p>IBAN: <strong>PK12 VTEX 0011 2233 4455 66</strong></p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Your order will not ship until we receive payment.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleContinue = () => {
    if (selectedPaymentId) {
      setCurrentStep(4); // Go to Review step
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

      <div className="flex flex-col gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedPaymentId === method.id;
          return (
            <div key={method.id} className={`rounded-xl border-2 transition-all ${
              isSelected ? 'border-[#ff6a00]' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div 
                onClick={() => setSelectedPaymentId(method.id)}
                className={`p-4 cursor-pointer flex items-center justify-between ${isSelected ? 'bg-[#ff6a00]/5 rounded-t-xl' : 'rounded-xl'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    {getIcon(method.icon)}
                  </div>
                  <h3 className="font-bold text-gray-900">{method.name}</h3>
                </div>
                
                {isSelected && (
                  <FiCheckCircle className="text-[#ff6a00] text-xl" />
                )}
              </div>

              {/* Render specific form below the method if selected */}
              <div className="px-4 pb-4">
                {renderPaymentForm(method.id)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Back to Delivery
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedPaymentId}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-colors ${
            selectedPaymentId 
              ? 'bg-[#ff6a00] hover:bg-[#e65c00]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;
