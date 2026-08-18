import { memo } from 'react'

const DeliveryMethods = ({ methods, selectedId, onSelect }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6">3. Delivery Method</h2>
      <div className="flex flex-col gap-3">
        {methods.map((method) => {
          const isSelected = selectedId === method.id
          return (
            <label 
              key={method.id} 
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected ? 'border-[#ff6a00] bg-orange-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <input 
                  type="radio" 
                  name="deliveryMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onSelect(method.id)}
                  className="w-5 h-5 text-[#ff6a00] border-gray-300 focus:ring-[#ff6a00] focus:ring-2 cursor-pointer"
                />
                <div>
                  <div className="text-[14px] font-bold text-gray-900 leading-none mb-1">{method.name}</div>
                  <div className="text-[12px] text-gray-500 leading-none">{method.estimatedDays}</div>
                </div>
              </div>
              <div className="text-[14px] font-bold text-gray-900">
                {method.price === 0 ? 'Free' : `Rs. ${method.price.toLocaleString()}`}
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default memo(DeliveryMethods)
