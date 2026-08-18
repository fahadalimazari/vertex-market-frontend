import React, { createContext, useState, useEffect } from 'react';
import { getPersonalizedRecommendations, getTrendingProducts } from '../services/recommendationService';

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted state
    const savedHistory = localStorage.getItem('vertex_ai_recommendations_v1');
    if (savedHistory) {
      setRecentlyViewed(JSON.parse(savedHistory));
    }

    const fetchInitialData = async () => {
      setLoading(true);
      const trending = await getTrendingProducts();
      setTrendingProducts(trending);
      
      const personalized = await getPersonalizedRecommendations('user123', recentlyViewed);
      setRecommendedProducts(personalized);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const viewProduct = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem('vertex_ai_recommendations_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('vertex_ai_recommendations_v1');
  };

  return (
    <RecommendationContext.Provider value={{
      recentlyViewed,
      recommendedProducts,
      trendingProducts,
      loading,
      viewProduct,
      clearHistory
    }}>
      {children}
    </RecommendationContext.Provider>
  );
};
