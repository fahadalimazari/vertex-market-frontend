import { memo } from 'react'
import { FiShoppingCart, FiCreditCard, FiCheckCircle, FiFileText, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const steps = [
  { id: 'cart', title: 'Cart', icon: FiShoppingCart, link: '/cart' },
  { id: 'checkout', title: 'Checkout', icon: FiCreditCard, active: true },
  { id: 'review', title: 'Review', icon: FiFileText },
  { id: 'success', title: 'Success', icon: FiCheckCircle },
]

const CheckoutSteps = () => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < steps.findIndex(s => s.active)
          const isActive = step.active

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-full">
              <div className="flex items-center justify-center w-full">
                {step.link ? (
                  <Link 
                    to={step.link}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-colors ${
                      isCompleted ? 'bg-[#ff6a00] text-white' : isActive ? 'bg-[#ff6a00] text-white ring-4 ring-[#ff6a00]/20' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon />
                  </Link>
                ) : (
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 ${
                      isActive ? 'bg-[#ff6a00] text-white ring-4 ring-[#ff6a00]/20' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon />
                  </div>
                )}
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 ${
                    isCompleted ? 'bg-[#ff6a00]' : 'bg-gray-100'
                  }`}></div>
                )}
              </div>
              <span className={`text-[12px] font-bold ${isActive ? 'text-[#ff6a00]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CheckoutSteps)
