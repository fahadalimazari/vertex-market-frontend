import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';

const StickyBar = ({ product, currentPrice, activeImage, currentStock, quantity, handleAddToCart, handleBuyNow }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolling past 600px (roughly past the main purchase box on desktop)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sticky Header (Top) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden lg:flex fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-50 items-center justify-between px-8"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 shrink-0">
                <img src={activeImage} alt={product?.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex flex-col truncate max-w-xl">
                <span className="font-bold text-gray-900 truncate">{product?.name}</span>
                <span className="text-sm font-medium text-gray-500">Rs. {currentPrice?.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className="h-10 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiShoppingCart className="text-lg" /> Add
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="h-10 px-8 bg-[#ff6a00] hover:bg-[#e65c00] text-white rounded-xl font-black text-sm transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Footer (Bottom) - Always visible on small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between gap-3 safe-area-bottom">
        <div className="flex-1 flex flex-col">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total Price</span>
          <span className="text-lg font-black text-[#ff6a00]">Rs. {(currentPrice * quantity).toLocaleString()}</span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <FiShoppingCart className="text-xl" />
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={currentStock === 0}
            className="h-12 px-6 bg-[#ff6a00] hover:bg-[#e65c00] text-white rounded-xl font-black text-sm transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
};

export default StickyBar;
