import { memo, useState } from 'react'
import { FiHeart } from 'react-icons/fi'

const WishlistButton = ({ productId }) => {
  const [isWished, setIsWished] = useState(false)

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWished(!isWished)
    // Future: dispatch(toggleWishlist(productId))
  }

  return (
    <button
      onClick={handleToggle}
      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#ff6a00] hover:bg-orange-50 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <FiHeart className={`text-[16px] ${isWished ? 'fill-[#ff6a00] text-[#ff6a00]' : ''}`} />
    </button>
  )
}

export default memo(WishlistButton)
