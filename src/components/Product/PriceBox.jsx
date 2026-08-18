import { memo } from 'react'

const PriceBox = ({ price, oldPrice, discount }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-2">
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-3xl font-bold text-[#ff6a00]">
          Rs. {price?.toLocaleString()}
        </span>
        
        {(oldPrice || discount > 0) && (
          <div className="flex items-center gap-2 pb-1">
            {oldPrice && (
              <span className="text-[16px] text-gray-400 line-through">
                Rs. {oldPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[12px] font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Dummy Installment Text */}
      <div className="text-[13px] text-gray-600 mt-1">
        Pay in 3 installments of <span className="font-bold text-gray-900">Rs. {Math.round(price / 3).toLocaleString()}</span>
      </div>
    </div>
  )
}

export default memo(PriceBox)
