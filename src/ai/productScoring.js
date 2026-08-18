import { products } from '../data/products';

// Mock AI product scoring algorithm
export const calculateProductScore = (product, userPreferences) => {
  let score = 0;
  
  // Base score from ratings
  score += (product.rating || 0) * 2;
  
  // Popularity boost
  score += Math.min((product.reviews || 0) / 100, 5);
  
  // Preference matching
  if (userPreferences?.categories?.includes(product.category)) {
    score += 10;
  }
  
  if (userPreferences?.brands?.includes(product.brand)) {
    score += 5;
  }

  // Discount boost
  if (product.discount > 0) {
    score += (product.discount / 10);
  }

  return score;
};
