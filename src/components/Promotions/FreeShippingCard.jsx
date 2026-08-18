import { memo } from 'react';
import { FiTruck, FiInfo } from 'react-icons/fi';

const FreeShippingCard = memo(({ campaign }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <FiTruck size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">{campaign.title}</h3>
          <p className="text-sm text-gray-600">{campaign.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] font-bold uppercase text-gray-500">
            {campaign.applicableCategories?.map(cat => (
              <span key={cat} className="bg-white px-2 py-1 rounded border border-gray-200">{cat}</span>
            ))}
            {campaign.applicableSellers?.map(seller => (
              <span key={seller} className="bg-white px-2 py-1 rounded border border-gray-200">
                {seller === 'marketplace' ? 'Vertex Market' : 'Specific Sellers'}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-blue-100 min-w-[200px] w-full md:w-auto text-center">
        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Minimum Order</div>
        <div className="text-2xl font-black text-gray-900">${campaign.minimumOrder}</div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <FiInfo /> Auto applied at checkout
        </div>
      </div>
    </div>
  );
});

FreeShippingCard.displayName = 'FreeShippingCard';
export default FreeShippingCard;
