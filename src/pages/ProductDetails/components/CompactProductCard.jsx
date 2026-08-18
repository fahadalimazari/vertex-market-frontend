import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';

const CompactProductCard = ({ _id, slug, name, price, oldPrice, discount, image, rating, reviews, stock }) => {
  const { addToCart } = useCart();
  const discountVal = discount || (oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (stock > 0) {
      addToCart({ _id, slug, name, price, image, stock, quantity: 1 });
      toast.success('Added to cart');
    }
  };

  return (
    <Link to={`/product/${slug || _id}`} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full relative p-3">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discountVal > 0 && (
          <span className="bg-[#ff6a00] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
            {discountVal}% OFF
          </span>
        )}
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 relative flex items-center justify-center">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {stock <= 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-[#ff6a00] transition-colors h-10">
          {name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <FiStar className="text-yellow-400 fill-current text-[10px]" />
          <span className="text-xs font-bold text-gray-900">{Number(rating || 0).toFixed(1)}</span>
          <span className="text-[10px] text-gray-400">({reviews || 0})</span>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-base font-black text-[#ff6a00] leading-none">
              Rs. {price?.toLocaleString()}
            </div>
            {oldPrice > price && (
              <div className="text-[10px] text-gray-400 line-through mt-0.5">
                Rs. {oldPrice?.toLocaleString()}
              </div>
            )}
          </div>
          <button 
            onClick={handleAdd}
            disabled={stock <= 0}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#ff6a00] hover:text-white text-gray-900 flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-900"
          >
            <FiShoppingCart className="text-sm" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CompactProductCard;
