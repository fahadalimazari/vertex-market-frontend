import { products } from '../data/products';

export const getTrendingProducts = (limit = 6) => {
  // Mock: products with high ratings and reviews
  return products
    .filter(p => p.rating >= 4.5 && p.reviews > 100)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, limit);
};

export const getRecentViewPredictions = () => {
  // Mock prediction of what they want to view next based on "recently viewed" (localStorage)
  const recentStr = localStorage.getItem('vertex_recently_viewed');
  if (!recentStr) return [];
  
  try {
    const recent = JSON.parse(recentStr);
    if (!recent || recent.length === 0) return [];
    
    const lastViewed = recent[0];
    const category = products.find(p => p.id === lastViewed)?.category;
    
    return products
      .filter(p => p.category === category && p.id !== lastViewed)
      .slice(0, 4);
  } catch(e) {
    return [];
  }
};
