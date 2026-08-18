import { mockTrendingProducts, mockPersonalizedRecommendations, mockFrequentlyBoughtTogether } from '../data/recommendations';

export const getTrendingProducts = async () => {
  // Simulate API call
  return new Promise(resolve => setTimeout(() => resolve(mockTrendingProducts), 500));
};

export const getPersonalizedRecommendations = async (userId, browsingHistory) => {
  // Simulate AI model generating recommendations based on history
  return new Promise(resolve => setTimeout(() => resolve(mockPersonalizedRecommendations), 600));
};

export const getFrequentlyBoughtTogether = async (productId) => {
  return new Promise(resolve => setTimeout(() => resolve(mockFrequentlyBoughtTogether), 400));
};

export const getSimilarProducts = async (productId) => {
  return new Promise(resolve => setTimeout(() => resolve(mockTrendingProducts), 500));
};
