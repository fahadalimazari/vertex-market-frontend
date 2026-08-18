import React, { useState } from 'react';
import { RecommendationSection } from './Recommendations';

const DiscoverMore = ({ currentProductId, category, subCategory }) => {
  const [activeTab, setActiveTab] = useState('ai-picks');

  const tabs = [
    { id: 'ai-picks', label: 'AI Picks', endpoint: '/api/products/recommendations/ai-recommended' },
    { id: 'trending', label: 'Trending', endpoint: '/api/products/recommendations/trending' },
    { id: 'best-sellers', label: 'Best Sellers', endpoint: '/api/products/recommendations/best-sellers' },
    { id: 'flash-sale', label: 'Flash Sale', endpoint: '/api/products/recommendations/flash-sale' },
    { id: 'new-arrivals', label: 'New Arrivals', endpoint: '/api/products/recommendations/new-arrivals' },
    { id: 'similar', label: 'Similar', endpoint: '/api/products/recommendations/similar' },
    { id: 'customers-also-bought', label: 'Others Bought', endpoint: '/api/products/recommendations/customers-also-bought' },
  ];

  return (
    <div className="mt-12 mb-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Discover More Products</h2>
      
      {/* Scrollable Tabs Header */}
      <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar mb-6">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 relative top-[1px]
              ${activeTab === tab.id ? 'text-[#ff6a00] border-[#ff6a00]' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lazy Load Only Active Tab */}
      <div className="min-h-[300px]">
        {tabs.map(tab => (
          activeTab === tab.id && (
            <RecommendationSection 
              key={tab.id} 
              endpoint={tab.endpoint} 
              title="" 
              params={{ category, subCategory, currentProductId }} 
            />
          )
        ))}
      </div>
    </div>
  );
};

export default DiscoverMore;
