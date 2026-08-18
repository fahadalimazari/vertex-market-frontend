import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiRepeat, FiFolder, FiEye, FiCheck, FiTruck, FiBox, FiTrendingUp } from 'react-icons/fi';
import PriceBox from './PriceBox';
import RatingStars from './RatingStars';
import QuickViewButton from './QuickViewButton';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import QuickViewModal from '../common/QuickViewModal';
import CollectionModal from '../Collections/CollectionModal';
import SellerBadge from '../common/SellerBadge';

const ProductCard = ({ product, showAIReason = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has variants, navigate to product details
    if (product.isVariable || (product.variants && product.variants.length > 0)) {
      navigate(`/product/${product.slug}`);
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(product, 1, null);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart in UI', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleCollectionOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollectionOpen(true);
  };

  const isWished = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  // Mock data for stock/delivery badges if not present
  const stockLevel = product.stock || 0;
  const hasFreeShipping = product.freeShipping === true;
  const isNew = product.isNewArrival || false;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-orange-200 transition-all duration-500 group flex flex-col h-full relative focus-within:ring-2 focus-within:ring-[#ff6a00] focus-within:outline-none">
      
      {/* Badges Area (Top Left) */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
        {product.discount > 0 && (
          <span className="bg-[#ff6a00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            -{product.discount}%
          </span>
        )}
        {isNew && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            NEW
          </span>
        )}
        {hasFreeShipping && (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
            <FiTruck size={10} /> Free Ship
          </span>
        )}
      </div>

      {/* Action Buttons Stacking (Top Right) - Slide in on hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={handleWishlistToggle}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:text-[#ff6a00] hover:bg-orange-50 hover:scale-110 transition-all"
          title={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart className={`text-[16px] ${isWished ? 'fill-[#ff6a00] text-[#ff6a00]' : ''}`} />
        </button>

        <button
          onClick={handleCompareToggle}
          className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 transition-all ${
            inCompare ? 'text-[#ff6a00] bg-orange-50' : 'text-gray-600 hover:text-[#ff6a00] hover:bg-orange-50'
          }`}
          title={inCompare ? "In Comparison" : "Add to Compare"}
        >
          <FiRepeat className="text-[16px]" />
        </button>

        <button
          onClick={handleCollectionOpen}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:text-[#ff6a00] hover:bg-orange-50 hover:scale-110 transition-all"
          title="Save to Collection"
        >
          <FiFolder className="text-[16px]" />
        </button>
      </div>

      {/* Product Image */}
      <Link 
        to={`/product/${product.slug}`}
        className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-6 outline-none"
      >
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        {/* Quick View Button (Center Overlay on Hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
             <button 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
               className="bg-white text-gray-900 hover:bg-gray-900 hover:text-white rounded-full px-4 py-2 font-bold text-sm flex items-center gap-2 shadow-lg transition-colors"
             >
               <FiEye /> Quick View
             </button>
          </div>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-1 gap-2 min-w-0">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-1 min-w-0 flex-1">
            <span className="truncate">{product.seller?.name || (typeof product.brand === 'object' ? product.brand?.name : product.brand)}</span>
            <div className="shrink-0 flex items-center">
              <SellerBadge badges={product.seller?.badges} />
            </div>
          </div>
          <div className="text-[10px] text-gray-400 shrink-0">{product.category}</div>
        </div>
        
        {stockLevel < 5 && stockLevel > 0 && (
             <div className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-2 shrink-0">
               <FiBox size={10} /> {stockLevel} left
             </div>
        )}
        
        <Link 
          to={`/product/${product.slug}`}
          className="text-[15px] text-gray-900 font-bold leading-tight mb-2 line-clamp-2 min-h-[44px] group-hover:text-[#ff6a00] transition-colors outline-none"
        >
          {product.name}
        </Link>


        
        <div className="mb-2">
          <RatingStars rating={product.rating} reviews={product.reviews} />
        </div>
        
        <div className="mt-auto pt-2">
          <PriceBox 
            price={product.price} 
            oldPrice={product.oldPrice} 
            discount={product.discount} 
            isVariable={product.isVariable}
          />
        </div>

        {/* Additional Stats: Delivery, Sold, Available */}
        <div className="mt-3 flex flex-col gap-1 text-[11px] text-gray-600 font-medium">
          {hasFreeShipping && (
            <div className="text-[#ff6a00] font-bold">Free Shipping</div>
          )}
          {product.estimatedDelivery && (
            <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
              <FiTruck className="text-[#ff6a00]" /> {product.estimatedDelivery}
            </div>
          )}
          <div className="flex justify-between items-center mt-1">
             <span className="flex items-center gap-1">
               <FiTrendingUp className="text-gray-400" /> 
               {product.sold || 0}+ Sold
             </span>
             <span className="flex items-center gap-1 text-green-600 font-bold">
               <FiBox /> 
               {stockLevel} Available
             </span>
          </div>
        </div>

        {/* AI Recommendation Reason */}
        {showAIReason && product.aiReason && (
          <div className="mt-3 bg-orange-50 p-3 rounded-xl border border-orange-100/50">
            <div className="text-[10px] font-black text-[#ff6a00] uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>✨ AI Pick</span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-2">
              {product.aiReason}
            </p>
          </div>
        )}
      </div>

      {/* Add to Cart Button (Bottom) */}
      <div className="mt-4">
        <button 
          onClick={handleAddToCart}
          disabled={isAdding || isAdded || stockLevel === 0}
          className={`w-full py-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] ${
            isAdded 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : isAdding
                ? 'bg-orange-100 text-[#ff6a00] cursor-wait'
                : stockLevel === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-[#ff6a00]'
          }`}
        >
          {isAdded ? (
            <>
              <FiCheck className="text-lg animate-scale-in" />
              Added!
            </>
          ) : isAdding ? (
            <>
              <div className="w-5 h-5 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : stockLevel === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <FiShoppingCart className="text-lg" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Collection Selection Modal */}
      {isCollectionOpen && (
        <CollectionModal
          isOpen={isCollectionOpen}
          onClose={() => setIsCollectionOpen(false)}
          product={product}
        />
      )}

      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={product} 
      />
    </div>
  );
};

export default memo(ProductCard);
