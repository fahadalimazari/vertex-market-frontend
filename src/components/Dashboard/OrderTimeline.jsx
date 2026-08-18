import { FiCheck, FiPackage, FiTruck, FiHome } from 'react-icons/fi'

const OrderTimeline = ({ currentStatus }) => {
  const steps = [
    { id: 'Placed', label: 'Order Placed', icon: FiCheck },
    { id: 'Confirmed', label: 'Confirmed', icon: FiCheck },
    { id: 'Packed', label: 'Packed', icon: FiPackage },
    { id: 'Shipped', label: 'Shipped', icon: FiTruck },
    { id: 'Out For Delivery', label: 'Out For Delivery', icon: FiTruck },
    { id: 'Delivered', label: 'Delivered', icon: FiHome }
  ]

  const getStatusIndex = () => {
    switch (currentStatus?.toLowerCase()) {
      case 'placed': return 0
      case 'confirmed': return 1
      case 'processing': // maps to packed
      case 'packed': return 2
      case 'shipped': return 3
      case 'out for delivery': return 4
      case 'delivered': 
      case 'completed': return 5
      case 'cancelled': return -1
      default: return 0
    }
  }

  const currentIndex = getStatusIndex()
  const isCancelled = currentIndex === -1

  return (
    <div className="py-6">
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500 ${isCancelled ? 'bg-red-500' : 'bg-[#ff6a00]'}`}
          style={{ width: isCancelled ? '100%' : `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 z-10 ${
                    isCancelled 
                      ? 'bg-red-500 text-white' 
                      : isCompleted 
                        ? 'bg-[#ff6a00] text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="text-sm" />
                </div>
                <div className="absolute top-12 mt-2 w-24 text-center -ml-12 left-1/2">
                  <p className={`text-[12px] font-bold ${
                    isCancelled ? 'text-red-500' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OrderTimeline
