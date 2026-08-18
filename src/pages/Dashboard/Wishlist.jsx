import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useDashboard } from '../../context/Dashboard/DashboardContext'
import { useCart } from '../../context/CartContext'

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useDashboard()
  const { addToCart } = useCart()
  const [deleteId, setDeleteId] = useState(null)

  const handleMoveToCart = (item) => {
    addToCart(item)
    removeFromWishlist(item.productId)
    toast.success('Product moved to cart')
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      removeFromWishlist(deleteId)
      toast.success('Product removed from wishlist')
      setDeleteId(null)
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6 text-4xl">
          <FiHeart />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Browse our products and add your favorites to the wishlist to easily find them later.</p>
        <Link 
          to="/products"
          className="bg-[#ff6a00] text-white px-8 py-3.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <span className="bg-orange-50 text-[#ff6a00] px-3 py-1 rounded-lg text-[13px] font-bold">
          {wishlist.length} Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map(item => (
          <div key={item.id || item.productId} className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group relative">
            <button 
              onClick={() => setDeleteId(item.productId)}
              className="absolute top-4 right-4 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all z-10 focus:outline-none shadow-sm"
              title="Remove from Wishlist"
            >
              <FiTrash2 className="text-[14px]" />
            </button>

            <Link to={`/product/${item.slug}`} className="block relative aspect-square bg-gray-50 rounded-2xl mb-4 p-4 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
              />
            </Link>

            <div className="px-2">
              <Link to={`/product/${item.slug}`}>
                <h3 className="text-[15px] font-bold text-gray-900 hover:text-[#ff6a00] transition-colors line-clamp-1 mb-1">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-black text-[#ff6a00]">Rs. {item.price.toLocaleString()}</span>
                {item.originalPrice && (
                  <span className="text-[13px] text-gray-400 line-through">Rs. {item.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <button 
                onClick={() => handleMoveToCart(item)}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-[14px] font-bold hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <FiShoppingCart /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Product"
        message="Are you sure you want to remove this product from your wishlist?"
        confirmText="Remove"
        confirmColor="bg-red-500"
      />
    </div>
  )
}

export default Wishlist
