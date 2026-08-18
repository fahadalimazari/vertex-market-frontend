import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiBookmark, FiMinus, FiPlus, FiHeart } from 'react-icons/fi'
import SellerBadge from '../common/SellerBadge'

const CartItem = ({ item, onUpdateQuantity, onRemove, onSaveForLater, onMoveToWishlist }) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const itemId = item._id || item.productId?._id || item.productId;
  const name = item.snapshotName || item.productId?.name || 'Product';
  const brand = item.snapshotBrand || item.productId?.seller?.name || (typeof item.productId?.brand === 'object' ? item.productId?.brand?.name : item.productId?.brand) || 'Generic';
  const badges = item.productId?.seller?.badges || [];
  const image = item.snapshotImage || item.productId?.image || '/placeholder.png';
  const slug = item.snapshotSlug || item.productId?.slug || '';
  const price = item.effectivePrice || item.unitPrice || 0;
  const originalPrice = item.unitPrice || price;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isAvailable = item.isAvailable !== false;
  const stock = item.productId?.stock || 10;
  const sku = item.snapshotSKU || item.productId?.sku || '';

  // Extract variants if present
  let variantText = null;
  if (item.snapshotVariant) {
    if (typeof item.snapshotVariant === 'string') {
      variantText = item.snapshotVariant;
    } else if (typeof item.snapshotVariant === 'object') {
      variantText = Object.entries(item.snapshotVariant)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
  }

  const handleRemoveClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmRemove = () => {
    onRemove(itemId)
    setShowConfirm(false)
  }

  const handleCancelRemove = () => {
    setShowConfirm(false)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start shadow-sm transition-all duration-300 hover:shadow-md">
      <Link to={slug ? `/product/${slug}` : '#'} className="w-full sm:w-32 h-40 sm:h-32 bg-gray-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-gray-100 group">
        <img src={image} alt={name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
      </Link>
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
          <div className="flex flex-col">
            <div className="text-[11px] font-bold text-[#ff6a00] uppercase tracking-wider mb-1 flex items-center gap-1 line-clamp-1">
              {brand}
              <SellerBadge badges={badges} />
            </div>
            <Link to={slug ? `/product/${slug}` : '#'} className="text-[16px] font-bold text-gray-900 leading-tight hover:text-[#ff6a00] transition-colors truncate-2-lines">
              {name}
            </Link>
            
            {sku && (
              <div className="text-[11px] text-gray-400 mt-1">SKU: {sku}</div>
            )}

            {/* Variants */}
            {variantText && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[12px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {variantText}
                </span>
              </div>
            )}
            
            <div className="mt-2 inline-block">
              {isAvailable ? (
                <span className="text-[12px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  In Stock
                </span>
              ) : (
                <span className="text-[12px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Out of Stock
                </span>
              )}
            </div>
            {item.warning && (
              <div className="text-[11px] text-red-500 mt-1 font-medium bg-red-50/50 p-1.5 rounded border border-red-100/50">
                {item.warning}
              </div>
            )}
          </div>
          
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="text-[18px] font-bold text-[#ff6a00]">Rs. {price.toLocaleString()}</div>
            {discountPercent > 0 && (
              <div className="text-[12px] text-gray-400 line-through">Rs. {originalPrice.toLocaleString()} ({discountPercent}% OFF)</div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 w-28 bg-white">
            <button 
              onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
              disabled={item.quantity <= 1 || !isAvailable}
              className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#ff6a00] disabled:opacity-50 transition-colors focus:outline-none"
              aria-label="Decrease quantity"
            >
              <FiMinus />
            </button>
            <div className="flex-1 h-full flex items-center justify-center text-[13px] font-bold text-gray-900 border-x border-gray-200">
              {item.quantity}
            </div>
            <button 
              onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
              disabled={item.quantity >= stock || !isAvailable}
              className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#ff6a00] disabled:opacity-50 transition-colors focus:outline-none"
              aria-label="Increase quantity"
            >
              <FiPlus />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => onSaveForLater(itemId)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#ff6a00] transition-colors focus:outline-none"
            >
              <FiBookmark /> Save for Later
            </button>
            
            <div className="hidden sm:block w-[1px] h-4 bg-gray-200"></div>

            <button 
              onClick={() => onMoveToWishlist && onMoveToWishlist(itemId)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#ff6a00] transition-colors focus:outline-none"
            >
              <FiHeart /> Wishlist
            </button>
            
            <div className="hidden sm:block w-[1px] h-4 bg-gray-200"></div>
            
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-gray-600">Remove?</span>
                <button onClick={handleConfirmRemove} className="text-[12px] font-bold text-red-600 hover:underline focus:outline-none">Yes</button>
                <button onClick={handleCancelRemove} className="text-[12px] font-bold text-gray-600 hover:underline focus:outline-none">No</button>
              </div>
            ) : (
              <button 
                onClick={handleRemoveClick}
                className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
              >
                <FiTrash2 /> Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CartItem)

