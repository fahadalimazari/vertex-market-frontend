import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
      <div className="text-[120px] mb-6 grayscale opacity-40 leading-none select-none">🛒</div>
      <h2 className="text-[28px] font-bold text-gray-900 mb-3">Your Shopping Cart is Empty</h2>
      <p className="text-[15px] text-gray-500 mb-8 max-w-md">
        Looks like you haven't added any products to your cart yet. Discover our amazing products and start shopping.
      </p>
      <Link 
        to="/products"
        className="bg-gray-900 text-white px-8 py-3.5 rounded-xl text-[15px] font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-sm"
      >
        <FiArrowLeft className="text-lg" />
        Continue Shopping
      </Link>
    </div>
  )
}

export default memo(EmptyCart)
