import { useContext } from 'react';
import { RecommendationContext } from '../context/RecommendationContext';

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};
