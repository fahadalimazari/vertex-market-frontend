import { useRecommendations } from '../../hooks/useRecommendations';
import { FiClock } from 'react-icons/fi';

const RecentlyViewedSlider = () => {
  const { recentlyViewed } = useRecommendations();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="my-12 py-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-500 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
        </div>
        <button className="text-sm text-orange-600 font-bold hover:text-orange-700">Clear History</button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {recentlyViewed.map((product, idx) => (
          <div key={`${product.id}-${idx}`} className="flex-none w-48 bg-white rounded-xl p-3 border border-gray-100 hover:border-orange-200 cursor-pointer group">
            <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
              <img src={product.image || 'https://placehold.co/150'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">{product.name}</h3>
            <div className="font-bold text-gray-900 text-sm">${product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSlider;
