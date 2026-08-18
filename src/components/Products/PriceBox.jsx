import { memo } from 'react'

const PriceBox = ({ price, oldPrice, discount, isVariable = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-[18px] font-bold text-[#ff6a00]">
          {isVariable && <span className="text-[12px] text-gray-500 font-medium mr-1">From</span>}
          Rs. {price?.toLocaleString() || 0}
        </span>
      </div>
      {(oldPrice || discount > 0) && (
        <div className="flex items-center gap-2">
          {oldPrice && (
            <span className="text-[12px] text-gray-400 line-through">
              Rs. {oldPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[12px] font-bold text-gray-900">
              -{discount}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(PriceBox)
