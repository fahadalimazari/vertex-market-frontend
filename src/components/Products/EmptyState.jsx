import { memo } from 'react'
import { Link } from 'react-router-dom'

const EmptyState = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
      <div className="text-5xl mb-4 grayscale opacity-60">📦</div>
      <h3 className="text-[18px] font-bold text-gray-900 mb-2">No products available</h3>
      <p className="text-[14px] text-gray-500 max-w-sm mb-6">
        We couldn't find any products in this section right now. Please check back later or explore other categories.
      </p>
      <Link 
        to="/products"
        className="bg-gray-900 text-white text-[14px] font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

export default memo(EmptyState)
