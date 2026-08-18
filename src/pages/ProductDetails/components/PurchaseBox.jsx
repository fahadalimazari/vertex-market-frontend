import React from 'react';
import { FiShoppingCart, FiHeart, FiShare2, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PurchaseBox = ({ 
  product, 
  currentPrice, 
  oldPrice, 
  currentStock, 
  quantity, 
  setQuantity, 
  handleAddToCart, 
  handleBuyNow,
  toggleWishlist,
  isWishlisted,
  addToCompare
}) => {
  return (
    <>
      {/* Pricing Box */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl md:text-5xl font-black text-[#ff6a00] tracking-tight">
              Rs. {currentPrice?.toLocaleString()}
            </span>
            {oldPrice > currentPrice && (
              <span className="text-xl text-gray-400 line-through font-medium mb-1.5">
                Rs. {oldPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-2 font-medium flex gap-2">
            {product.taxClass && <span>Inclusive of all taxes</span>}
            {product.emiAvailable && <span className="text-indigo-600 font-bold border border-indigo-100 bg-indigo-50 px-2 py-0.5 rounded">EMI / Installments Available</span>}
          </div>
        </div>
      </div>

      {/* Actions Box */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Quantity */}
          <div className="flex items-center bg-gray-50 rounded-2xl h-14 border border-gray-200 w-full sm:w-36 shrink-0 shadow-sm">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black font-black text-lg transition-colors">-</button>
            <div className="flex-1 text-center font-black text-base bg-transparent border-none outline-none flex items-center justify-center">{quantity}</div>
            <button onClick={() => setQuantity(q => Math.min(currentStock || 99, q + 1))} className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black font-black text-lg transition-colors">+</button>
          </div>

          {/* Buy Now */}
          <button 
            onClick={handleBuyNow}
            disabled={currentStock === 0}
            className="w-full h-14 bg-[#ff6a00] hover:bg-[#e65c00] text-white rounded-2xl font-black text-base transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            Buy Now
          </button>
          
          {/* Add to Cart */}
          <button 
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-base transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <FiShoppingCart className="text-xl" /> Add to Cart
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 pt-4 text-sm font-bold text-gray-500">
          <button onClick={() => toggleWishlist(product)} className={`flex items-center gap-2 hover:text-[#ff6a00] transition-colors ${isWishlisted ? 'text-[#ff6a00]' : ''}`}>
            <FiHeart className={`text-lg ${isWishlisted ? 'fill-current' : ''}`} /> {isWishlisted ? 'Saved' : 'Wishlist'}
          </button>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <button onClick={() => addToCompare(product)} className="flex items-center gap-2 hover:text-[#ff6a00] transition-colors">
            <FiBarChart2 className="text-lg" /> Compare
          </button>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!'); }} className="flex items-center gap-2 hover:text-[#ff6a00] transition-colors">
            <FiShare2 className="text-lg" /> Share
          </button>
        </div>
      </div>
    </>
  );
};

export default PurchaseBox;
