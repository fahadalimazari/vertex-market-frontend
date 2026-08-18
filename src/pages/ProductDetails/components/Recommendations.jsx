import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompactProductCard from './CompactProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const ProductSlider = ({ title, products, subtitle }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
          {title} 
          {subtitle && <span className="hidden sm:inline-block text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase tracking-wider">{subtitle}</span>}
        </h2>
        {/* Simple navigation visual placeholder */}
        <div className="hidden sm:flex gap-1.5">
          <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors">
            <FiChevronLeft className="text-sm" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors">
            <FiChevronRight className="text-sm" />
          </button>
        </div>
      </div>
      
      {/* Scrollable container with precise card widths: ~100% on mobile, 50% on tablet, 25% on desktop */}
      <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
        {products.map(product => (
          <div key={product._id || product.slug} className="w-[85vw] sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] shrink-0 snap-start">
            <CompactProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecommendationSection = ({ endpoint, title, subtitle, params = {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000${endpoint}`, { params });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error(`Error fetching recommendations for ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if endpoint is valid
    if (endpoint) {
      fetchRecommendations();
    }
  }, [endpoint, JSON.stringify(params)]);

  if (loading) return null; // Don't show loaders, just hide until ready
  if (products.length === 0) return null; // Gracefully hide if no data

  return <ProductSlider title={title} subtitle={subtitle} products={products} />;
};
