import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye, FiCheck, FiTruck, FiBox, FiRepeat } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import PriceBox from './PriceBox';
import RatingStars from './RatingStars';
import SellerBadge from '../common/SellerBadge';
import QuickViewModal from '../common/QuickViewModal';

const SearchListCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, 1, null);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
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

  const isWished = isInWishlist(product.id || product._id);
  const inCompare = isInCompare(product.id || product._id);
  
  const stockLevel = product.stock || Math.floor(Math.random() * 20);
  const hasFreeShipping = product.price > 50;

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="flex flex-col sm:flex-row gap-6 bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl hover:shadow-xl hover:border-orange-200 transition-all duration-300 group"
    >
      {/* Left: Image Box */}
      <div className="relative w-full sm:w-[240px] shrink-0 bg-gray-50 rounded-xl overflow-hidden aspect-square sm:aspect-auto sm:h-[240px] flex items-center justify-center">
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply p-4"
          loading="lazy"
        />
        
        {/* Quick Actions (Desktop Hover) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-3">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
            className="w-full bg-white text-gray-800 border border-gray-200 py-2 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
            aria-label="Quick view product"
          >
            <FiEye className="text-lg text-gray-500" />
            Quick View
          </button>
          <button 
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full bg-white flex items-center justify-center transition-colors ${
              isWished ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-[#ff6a00] hover:text-white'
            }`}
            title="Wishlist"
          >
            <FiHeart className={isWished ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={handleCompareToggle}
            className={`w-10 h-10 rounded-full bg-white flex items-center justify-center transition-colors ${
              inCompare ? 'text-[#ff6a00] bg-orange-50' : 'text-gray-600 hover:bg-[#ff6a00] hover:text-white'
            }`}
            title="Compare"
          >
            <FiRepeat />
          </button>
        </div>
      </div>

      {/* Middle: Info */}
      <div className="flex-1 flex flex-col min-w-0 py-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {(product.seller?.name || product.brand) && (
            <span className="text-[12px] font-bold text-[#ff6a00] uppercase tracking-wide flex items-center gap-1">
              {product.seller?.name || (typeof product.brand === 'object' ? product.brand?.name : product.brand)}
              <SellerBadge badges={product.seller?.badges} />
            </span>
          )}
          <span className="text-gray-300">•</span>
          <span className="text-[12px] font-medium text-gray-500">
            {product.category || 'Category'}
          </span>
        </div>

        <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 leading-tight mb-3 group-hover:text-[#ff6a00] transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <RatingStars rating={product.rating} />
          <span className="text-[13px] text-gray-500">
            ({product.reviews || 0} reviews)
          </span>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <span className="text-[13px] text-gray-500 hidden sm:inline">
            100+ bought in past month
          </span>
        </div>

        <p className="text-[14px] text-gray-600 line-clamp-3 mb-4 flex-1">
          {product.shortDescription || "Premium quality product with excellent features. Experience the best performance and reliability tailored for your needs."}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          {hasFreeShipping && (
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              <FiTruck /> Free Shipping
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <FiBox /> Seller: Premium Store
          </div>
        </div>
      </div>

      {/* Right: Checkout & Price box */}
      <div className="w-full sm:w-[220px] shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 flex flex-col">
        
        <div className="mb-6">
          <PriceBox 
            price={product.price} 
            oldPrice={product.oldPrice} 
            discount={product.discount} 
            size="lg" 
          />
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <div className="text-[13px] font-medium text-gray-600 mb-2">
            {product.inStock ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <FiCheck /> In Stock ({stockLevel})
              </span>
            ) : (
              <span className="text-red-500 font-bold">Out of Stock</span>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding || isAdded}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              !product.inStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#ff6a00] text-white hover:bg-[#e65c00] hover:shadow-lg hover:shadow-orange-500/20'
            }`}
          >
            {isAdded ? (
              <><FiCheck className="text-lg" /> Added</>
            ) : isAdding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FiShoppingCart className="text-lg" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>

      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={product} 
      />
    </Link>
  );
};

export default SearchListCard;
