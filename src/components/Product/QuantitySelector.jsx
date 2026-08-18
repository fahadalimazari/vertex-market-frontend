import { memo } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const QuantitySelector = ({ stock, quantity, onChange }) => {
  const handleDecrease = () => onChange(prev => (prev > 1 ? prev - 1 : 1))
  const handleIncrease = () => onChange(prev => (prev < stock ? prev + 1 : stock))

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-bold text-gray-900">Quantity</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10 w-32 bg-white">
          <button 
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 transition-colors focus:outline-none focus:bg-gray-50"
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          
          <div className="flex-1 h-full flex items-center justify-center text-[14px] font-bold text-gray-900 border-x border-gray-200">
            {quantity}
          </div>
          
          <button 
            onClick={handleIncrease}
            disabled={quantity >= stock}
            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 transition-colors focus:outline-none focus:bg-gray-50"
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>
        
        {stock > 0 && stock <= 15 && (
          <span className="text-[12px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
            Only {stock} Left
          </span>
        )}
      </div>
    </div>
  )
}

export default memo(QuantitySelector)
