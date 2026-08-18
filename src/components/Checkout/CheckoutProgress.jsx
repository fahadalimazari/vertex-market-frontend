import { FiMapPin, FiTruck, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';

const steps = [
  { id: 1, title: 'Address', icon: FiMapPin },
  { id: 2, title: 'Delivery', icon: FiTruck },
  { id: 3, title: 'Payment', icon: FiCreditCard },
  { id: 4, title: 'Review', icon: FiCheckCircle },
];

const CheckoutProgress = () => {
  const { currentStep, setCurrentStep } = useCheckout();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          // Allow clicking previous steps
          const isClickable = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-full">
              <div className="flex items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => isClickable && setCurrentStep(step.id)}
                  disabled={!isClickable && !isActive}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-colors ${
                    isCompleted 
                      ? 'bg-[#ff6a00] text-white cursor-pointer hover:bg-[#e65c00]' 
                      : isActive 
                        ? 'bg-[#ff6a00] text-white ring-4 ring-[#ff6a00]/20' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon />
                </button>

                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 transition-colors ${
                    isCompleted ? 'bg-[#ff6a00]' : 'bg-gray-100'
                  }`}></div>
                )}
              </div>
              <span className={`text-[12px] font-bold ${isActive ? 'text-[#ff6a00]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;
