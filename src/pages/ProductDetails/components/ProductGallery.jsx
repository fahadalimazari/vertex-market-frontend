import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductGallery = ({ product, activeImage, setActiveImage, gallery, discountPercentage }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const idx = gallery.findIndex(img => img === activeImage);
    if (idx !== -1) setCurrentIndex(idx);
  }, [activeImage, gallery]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!gallery || gallery.length <= 1) return;
    const nextIdx = (currentIndex + 1) % gallery.length;
    setCurrentIndex(nextIdx);
    setActiveImage(gallery[nextIdx]);
  };

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!gallery || gallery.length <= 1) return;
    const prevIdx = (currentIndex - 1 + gallery.length) % gallery.length;
    setCurrentIndex(prevIdx);
    setActiveImage(gallery[prevIdx]);
  };

  // Limit to 10 images max as requested
  const displayGallery = gallery.slice(0, 10);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 sticky top-24 h-max">
      {/* Vertical Thumbnails (Desktop) */}
      <div className="hidden md:flex flex-col gap-3 w-20 shrink-0 h-[500px] overflow-y-auto hide-scrollbar pb-4 pr-1">
        {displayGallery.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => { setActiveImage(img); setCurrentIndex(idx); }}
            className={`w-full aspect-square shrink-0 border-2 rounded-2xl p-2 bg-white cursor-pointer overflow-hidden transition-all duration-300 ${activeImage === img ? 'border-orange-500 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'}`}
          >
            <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt={`${product?.name} thumbnail ${idx + 1}`} />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 aspect-square md:aspect-auto md:h-[500px] p-6 flex items-center justify-center relative overflow-hidden group shadow-sm cursor-zoom-in" onClick={() => setIsFullScreen(true)}>
        <AnimatePresence mode="wait">
          {activeImage ? (
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={activeImage} 
              alt={product?.name} 
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">No Image</div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {discountPercentage > 0 && (
            <span className="bg-[#ff6a00] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
          {product?.isFeatured && (
            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              Featured
            </span>
          )}
        </div>

        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFullScreen(true); }}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-gray-700 hover:text-orange-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          <FiZoomIn className="text-xl" />
        </button>

        {/* Arrows for mobile/desktop inside main image */}
        {gallery.length > 1 && (
          <>
            <button type="button" onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all">
              <FiChevronLeft className="text-xl -ml-0.5" />
            </button>
            <button type="button" onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all">
              <FiChevronRight className="text-xl -mr-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Horizontal Thumbnails (Mobile only) */}
      <div className="flex md:hidden gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {displayGallery.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => { setActiveImage(img); setCurrentIndex(idx); }}
            className={`w-16 h-16 shrink-0 border-2 rounded-xl p-1 bg-white cursor-pointer overflow-hidden transition-all duration-300 ${activeImage === img ? 'border-orange-500 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'}`}
          >
            <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt={`${product?.name} thumbnail ${idx + 1}`} />
          </div>
        ))}
      </div>

      {/* Full Screen Modal */}
      {createPortal(
        <AnimatePresence>
          {isFullScreen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-gray-900/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4 md:p-12"
            >
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFullScreen(false); }}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/20 z-50"
              >
                <FiX className="text-2xl" />
              </button>
              
              <div className="absolute top-6 left-6 bg-black/50 px-4 py-2 rounded-full text-white font-bold text-sm tracking-wider">
                {currentIndex + 1} / {displayGallery.length}
              </div>

              <div className="w-full max-w-7xl h-full flex flex-col relative">
                <div className="flex-1 w-full relative flex items-center justify-center mb-6">
                  {activeImage && (
                    <img src={activeImage} alt="Full Screen Preview" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                  )}
                  
                  {displayGallery.length > 1 && (
                    <>
                      <button type="button" onClick={handlePrev} className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                        <FiChevronLeft className="text-3xl -ml-1" />
                      </button>
                      <button type="button" onClick={handleNext} className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                        <FiChevronRight className="text-3xl -mr-1" />
                      </button>
                    </>
                  )}
                </div>
                <div className="h-24 shrink-0 flex items-center justify-center gap-3 overflow-x-auto px-4 hide-scrollbar">
                  {displayGallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setActiveImage(img); setCurrentIndex(idx); }}
                      className={`h-20 w-20 shrink-0 rounded-2xl p-2 cursor-pointer transition-all duration-300 ${activeImage === img ? 'bg-white/20 border-2 border-white scale-110' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                    >
                      <img src={img} className="w-full h-full object-contain" alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ProductGallery;
