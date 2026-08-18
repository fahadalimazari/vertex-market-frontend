import { memo, useState } from 'react';
import { FiShoppingCart, FiCreditCard, FiHeart, FiRepeat, FiShare2, FiFolder } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import CollectionModal from '../Collections/CollectionModal';
import toast from 'react-hot-toast';

const ActionButtons = ({ product, quantity, variant }) => {
  const [showToast, setShowToast] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity || 1, variant || null);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleShare = () => {
    if (!product) return;
    const dummyUrl = `${window.location.origin}/product/${product.slug}`;
    navigator.clipboard.writeText(dummyUrl);
    toast.success('Product link copied to clipboard!');
  };

  const isWished = product ? isInWishlist(product.id) : false;
  const inCompare = product ? isInCompare(product.id) : false;

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-[#ff6a00] text-white py-3.5 rounded-xl text-[15px] font-bold hover:bg-[#e65c00] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] shadow-sm shadow-[#ff6a00]/20"
        >
          <FiShoppingCart className="text-xl" />
          Add to Cart
        </button>
        <button 
          className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl text-[15px] font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-sm"
        >
          <FiCreditCard className="text-xl" />
          Buy Now
        </button>
      </div>

      {/* Reusable Personalization actions block */}
      <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start mt-2 border-t border-b border-gray-100 py-3">
        {/* Wishlist */}
        <button 
          onClick={() => product && toggleWishlist(product)}
          className={`flex items-center gap-2 text-[13px] font-bold transition-colors focus:outline-none ${
            isWished ? 'text-[#ff6a00]' : 'text-gray-500 hover:text-[#ff6a00]'
          }`}
        >
          <FiHeart className={`text-lg ${isWished ? 'fill-[#ff6a00]' : ''}`} />
          <span>Wishlist</span>
        </button>
        
        <div className="w-[1px] h-4 bg-gray-200"></div>
        
        {/* Compare */}
        <button 
          onClick={() => product && toggleCompare(product)}
          className={`flex items-center gap-2 text-[13px] font-bold transition-colors focus:outline-none ${
            inCompare ? 'text-[#ff6a00]' : 'text-gray-500 hover:text-[#ff6a00]'
          }`}
        >
          <FiRepeat className="text-lg" />
          <span>Compare</span>
        </button>
        
        <div className="w-[1px] h-4 bg-gray-200"></div>

        {/* Save to Collection */}
        <button 
          onClick={() => setIsCollectionOpen(true)}
          className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-[#ff6a00] transition-colors focus:outline-none"
        >
          <FiFolder className="text-lg" />
          <span>Save</span>
        </button>
        
        <div className="w-[1px] h-4 bg-gray-200"></div>
        
        {/* Share Link */}
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-[#ff6a00] transition-colors focus:outline-none"
        >
          <FiShare2 className="text-lg" />
          <span>Share</span>
        </button>
      </div>

      {/* Temporary Toast Overlay */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[14px] font-bold px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in-up flex items-center gap-3">
          <FiShoppingCart className="text-lg text-[#ff6a00]" />
          Added to Cart Successfully!
        </div>
      )}

      {/* Collection Modal Overlay */}
      {isCollectionOpen && product && (
        <CollectionModal
          isOpen={isCollectionOpen}
          onClose={() => setIsCollectionOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};

export default memo(ActionButtons);
