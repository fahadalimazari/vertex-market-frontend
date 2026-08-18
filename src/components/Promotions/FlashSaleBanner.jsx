import { memo, useState, useEffect, useCallback } from 'react';
import { FiClock, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import FlashSaleTimer from './FlashSaleTimer';

const FlashSaleBanner = memo(({ flashSale }) => {
  if (!flashSale || flashSale.status !== 'active') return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-lg mb-8 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={flashSale.bannerImage} 
          alt={flashSale.title} 
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Live Now
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
            {flashSale.title}
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            {flashSale.description}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4 min-w-[280px]">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 w-full text-center">
            <div className="text-white text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <FiClock className="text-[#ff6a00]" /> Ends In
            </div>
            <FlashSaleTimer targetDate={flashSale.endTime} />
          </div>
          <Link 
            to="/flash-sale"
            className="w-full bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Shop Now <FiChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
});

FlashSaleBanner.displayName = 'FlashSaleBanner';
export default FlashSaleBanner;
