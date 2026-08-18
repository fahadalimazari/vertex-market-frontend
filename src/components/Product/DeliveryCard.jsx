import { memo } from 'react'
import { FiTruck, FiShield, FiCornerUpLeft, FiDollarSign } from 'react-icons/fi'

const DeliveryCard = ({ delivery }) => {
  if (!delivery) return null

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-8">
      <h3 className="text-[14px] font-bold text-gray-900 mb-4">Delivery & Services</h3>
      
      <div className="flex flex-col gap-4">
        {delivery.freeDelivery && (
          <div className="flex items-start gap-3">
            <FiTruck className="text-xl text-[#ff6a00] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-gray-900">Free Delivery</div>
              <div className="text-[12px] text-gray-500">Estimated: {delivery.estimated}</div>
            </div>
          </div>
        )}
        
        {delivery.cashOnDelivery && (
          <div className="flex items-start gap-3">
            <FiDollarSign className="text-xl text-[#ff6a00] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-gray-900">Cash on Delivery Available</div>
              <div className="text-[12px] text-gray-500">Pay when you receive the product</div>
            </div>
          </div>
        )}

        {delivery.returnPolicy && (
          <div className="flex items-start gap-3">
            <FiCornerUpLeft className="text-xl text-[#ff6a00] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-gray-900">{delivery.returnPolicy}</div>
              <div className="text-[12px] text-gray-500">Change of mind is not applicable</div>
            </div>
          </div>
        )}

        {delivery.warranty && (
          <div className="flex items-start gap-3 pt-4 border-t border-gray-100 mt-1">
            <FiShield className="text-xl text-[#ff6a00] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-gray-900">{delivery.warranty}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(DeliveryCard)
