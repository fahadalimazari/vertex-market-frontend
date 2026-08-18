import { products } from '../data/products';
import { calculateProductScore } from './productScoring';

export const getPersonalizedRecommendations = (userPreferences, limit = 8) => {
  const scored = products.map(p => ({
    ...p,
    aiScore: calculateProductScore(p, userPreferences)
  }));
  
  return scored
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, limit);
};

export const getSimilarProducts = (productId, limit = 4) => {
  const sourceProduct = products.find(p => p.id === productId);
  if (!sourceProduct) return [];

  return products
    .filter(p => p.id !== productId && p.category === sourceProduct.category)
    .sort(() => 0.5 - Math.random()) // Mock similarity
    .slice(0, limit);
};

export const getFrequentlyBoughtTogether = (productId) => {
  const sourceProduct = products.find(p => p.id === productId);
  if (!sourceProduct) return [];

  // Mock: If it's electronics, return accessories
  return products
    .filter(p => p.id !== productId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
};
