import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi'

const SaveForLater = ({ items, onMoveToCart, onRemove }) => {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
        Saved for Later ({items.length})
      </h2>
      
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <div className="flex gap-4 items-center w-full sm:w-auto flex-1 min-w-0">
              <Link to={`/product/${item.slug}`} className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0 border border-gray-100 group">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="text-[14px] font-bold text-gray-900 hover:text-[#ff6a00] transition-colors truncate block">
                  {item.name}
                </Link>
                <div className="text-[15px] font-bold text-[#ff6a00] mt-1">
                  Rs. {item.price.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={() => onMoveToCart(item.id)}
                className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <FiShoppingCart /> Move to Cart
              </button>
              <button 
                onClick={() => onRemove(item.id)}
                className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-[13px] font-bold hover:text-red-500 transition-colors flex items-center justify-center focus:outline-none shrink-0"
                aria-label="Remove saved item"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(SaveForLater)
