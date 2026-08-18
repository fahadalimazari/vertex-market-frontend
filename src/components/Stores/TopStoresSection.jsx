import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAward } from 'react-icons/fi';
import StoreCard from './StoreCard';
import storeService from '../../services/storeService';

const TopStoresSection = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.getPublicStores(5); // Fetch top 5 stores
        setStores(data);
      } catch (error) {
        console.error('Failed to fetch top stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiAward className="text-[#ff6a00]" /> Top Stores
          </h2>
          <p className="text-[12px] sm:text-sm text-gray-500 mt-1">Discover trusted stores and shop from top-rated sellers.</p>
        </div>
        <Link to="/stores" className="text-xs sm:text-sm font-bold bg-white text-gray-800 border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-50 hover:text-[#ff6a00] transition-colors shadow-sm shrink-0">
          View All Stores
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm h-[200px] animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-2.5 bg-gray-200 rounded w-3/5"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-2.5 bg-gray-200 rounded"></div>
                <div className="h-2.5 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-xl mt-auto"></div>
            </div>
          ))
        ) : stores.length > 0 ? (
          stores.map(store => (
            <StoreCard key={store._id} store={store} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-500 font-medium">No approved stores available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopStoresSection;
