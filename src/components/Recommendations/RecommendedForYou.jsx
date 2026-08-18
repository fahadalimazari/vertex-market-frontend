import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecommendations } from '../../hooks/useRecommendations';
import { sessionService } from '../../services/auth/sessionService';
import { FiCpu } from 'react-icons/fi';
import ProductSection from '../Products/ProductSection';

const RecommendedForYou = () => {
  const { recentlyViewed } = useRecommendations();
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const viewedIds = recentlyViewed.map(p => p._id || p.id).join(',');
        const token = sessionService.getSession()?.token;
        
        const config = {
          params: { viewedIds }
        };
        
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
        
        // Ensure consistent API URL
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const res = await axios.get(`${apiUrl}/products/recommendations/ai-recommended`, config);
        
        if (res.data && res.data.success) {
          setRecommendedItems(res.data.data || []);
        } else {
          setRecommendedItems([]);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [recentlyViewed]);

  if (!isLoading && recommendedItems.length === 0) {
    return (
      <ProductSection 
        title={<div className="flex items-center gap-2"><FiCpu className="text-indigo-500" /> Recommended For You</div>} 
        description="Explore more products to get personalized recommendations."
        products={[]}
      />
    );
  }

  return (
    <ProductSection 
      title={<div className="flex items-center gap-2"><FiCpu className="text-indigo-500" /> Recommended For You</div>} 
      description="Personalized picks based on your shopping behavior."
      products={recommendedItems}
      isLoading={isLoading}
      skeletonCount={6}
    />
  );
};

export default RecommendedForYou;
