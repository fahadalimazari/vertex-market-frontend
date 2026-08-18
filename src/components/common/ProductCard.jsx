import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye, FiBarChart2, FiCheck, FiTruck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import QuickViewModal from './QuickViewModal';
import { useWishlist } from '../../context/WishlistContext';
import SellerBadge from './SellerBadge';

const ProductCard = memo(({ 
  _id,
  id,
  image, 
  name, 
  price, 
  comparePrice, // From backend
  oldPrice, // Legacy support
  discountValue, // From backend
  discount, // Legacy support
  slug, 
  stock, 
  seller, // From backend
  sellerName, // Legacy
  estimatedDelivery, // From backend
  deliveryDate, // Legacy
  rating,
  reviews,
  isOfficialStore,
  isAiRecommended,
  freeShipping,
  emiAvailable,
  warranty,
  sold = 0, // From backend
  maxSold = 500 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const productSlug = slug || (name ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') : "product");
  const productId = _id || id || productSlug;
  const isWishlisted = isInWishlist(productId);

  const actualReviews = reviews || 0;
  const actualRating = rating || 0;
  
  const actualOldPrice = comparePrice || oldPrice;
  const actualDiscount = discountValue || discount;
  const actualSellerName = seller?.name || sellerName;
  const actualDelivery = estimatedDelivery || deliveryDate;

  // Calculate stock progress
  const actualSold = sold > 0 ? sold : Math.max(0, maxSold - (stock || 0));
  const progress = Math.min(100, Math.max(0, (actualSold / maxSold) * 100));
  const isLowStock = stock <= 15 && stock > 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: productId,
      name, slug: productSlug, image, price, oldPrice: actualOldPrice, discount: actualDiscount, rating, reviews, stock
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(isAddingToCart || addedToCart) return;
    
    setIsAddingToCart(true);
    // Simulate network request
    setTimeout(() => {
      setIsAddingToCart(false);
      setAddedToCart(true);
      toast.success('Added to Cart!');
      
      // Reset after some time
      setTimeout(() => setAddedToCart(false), 2000);
    }, 800);
  };

  const handleQuickAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if(action === 'view') {
      setIsQuickViewOpen(true);
    } else if (action === 'compare') {
      toast.success('Added to Compare');
    }
  };

  return (
    <>
      <motion.div 
        className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // Removed whileHover y: -5 so the card stays still
    >
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isAiRecommended && (
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <FiStar size={10} /> AI Pick
          </span>
        )}
        {actualDiscount > 0 && (
          <span className="bg-[#ff6a00] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {actualDiscount}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors"
      >
        <motion.div
          animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <FiHeart className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
        </motion.div>
      </button>

      {/* Product Image & Hover Actions */}
      <Link to={`/product/${productSlug}`} className="relative aspect-square bg-white flex items-center justify-center p-2 sm:p-4 overflow-hidden block">
        <motion.img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
        />
        
        {/* Quick Actions (View / Compare) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center gap-1 sm:gap-2 px-1 sm:px-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <button onClick={(e) => handleQuickAction(e, 'view')} className="bg-white/90 backdrop-blur text-gray-800 text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 px-2 sm:px-3 rounded-full shadow-md hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-1">
                <FiEye className="max-sm:w-3 max-sm:h-3" /> <span className="max-sm:hidden">Quick View</span>
              </button>
              <button onClick={(e) => handleQuickAction(e, 'compare')} className="bg-white/90 backdrop-blur text-gray-800 text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 px-2 sm:px-3 rounded-full shadow-md hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-1">
                <FiBarChart2 className="max-sm:w-3 max-sm:h-3" /> <span className="max-sm:hidden">Compare</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
      
      {/* Content Area */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {/* Seller Info */}
        {actualSellerName && (
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 mb-1">
            <span className="line-clamp-1 max-w-[120px]">{actualSellerName}</span>
            <SellerBadge badges={seller?.badges} />
          </div>
        )}

        {/* Title */}
        <Link to={`/product/${productSlug}`}>
          <h3 className="text-[12px] sm:text-[14px] text-gray-800 font-medium leading-snug mb-1.5 sm:mb-2 line-clamp-2 hover:text-orange-600 transition-colors min-h-[34px] sm:min-h-[40px]">
            {name}
          </h3>
        </Link>
        
        {/* Ratings */}
        {actualRating !== undefined && actualRating !== null && (
          <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
            <div className="flex text-yellow-400 text-[10px] sm:text-[12px]">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(actualRating) ? 'fill-current' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-500">({actualReviews})</span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
          <span className="text-[15px] sm:text-[18px] font-black text-gray-900 leading-none">Rs. {price?.toLocaleString()}</span>
          {actualOldPrice && (
            <span className="text-[10px] sm:text-[12px] text-gray-400 line-through leading-none">Rs. {actualOldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Badges/Delivery */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {freeShipping && <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">Free Shipping</span>}
          {emiAvailable && <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">EMI</span>}
        </div>
        
        {actualDelivery && (
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-600 mb-2 sm:mb-3 line-clamp-1">
            <FiTruck className="text-gray-400 shrink-0" /> 
            <span className="truncate">{actualDelivery}</span>
          </div>
        )}

        {/* Spacer to push stock and button to bottom */}
        <div className="flex-1"></div>

        {/* Stock Status */}
        {stock !== undefined && (
          <div className="mb-2 sm:mb-3">
            <div className="flex justify-between text-[9px] sm:text-[11px] mb-1 font-medium">
              <span className="text-gray-500">{actualSold}+ Sold</span>
              <span className={isLowStock ? 'text-red-500 font-bold' : 'text-gray-500'}>
                {stock === 0 ? 'Out of Stock' : isLowStock ? `Only ${stock} Left` : `${stock} Available`}
              </span>
            </div>
            <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-gradient-to-r from-[#ff6a00] to-[#ff9800]'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart || addedToCart || stock === 0}
          className={`w-full py-2 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all overflow-hidden relative ${
            addedToCart 
              ? 'bg-green-500 text-white' 
              : stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500'
          }`}
        >
          <AnimatePresence mode="wait">
            {isAddingToCart ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5 sm:gap-2"
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </motion.div>
            ) : addedToCart ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1"
              >
                <FiCheck className="w-3 h-3 sm:w-[18px] sm:h-[18px]" /> Added
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 sm:gap-2"
              >
                <FiShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> {stock === 0 ? 'Out of Stock' : 'Add'}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
    
    <QuickViewModal 
      isOpen={isQuickViewOpen} 
      onClose={() => setIsQuickViewOpen(false)} 
      product={{ id: productId, _id: productId, image, name, price, oldPrice: actualOldPrice, discount: actualDiscount, slug, stock, sellerName: actualSellerName, isOfficialStore, rating: actualRating, reviews: actualReviews, deliveryDate: actualDelivery }} 
    />
  </>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
