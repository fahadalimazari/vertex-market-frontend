import { useContext } from 'react';
import { PromotionContext } from '../context/PromotionContext';

export const usePromotions = () => {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
};
