import { useState, useEffect } from 'react';
import { FiAward, FiSearch } from 'react-icons/fi';
import StoreCard from '../../components/Stores/StoreCard';
import storeService from '../../services/storeService';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.getPublicStores(100); // Fetch up to 100 top stores
        setStores(data);
        setFilteredStores(data);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredStores(
        stores.filter(store => 
          store.name?.toLowerCase().includes(term) || 
          store.description?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, stores]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <FiAward className="text-[#ff6a00]" /> Top Stores
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              Discover trusted stores and shop from top-rated sellers. We verify and rank stores based on customer feedback and activity.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all bg-white text-sm font-medium"
            />
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 15 }).map((_, idx) => (
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
          ) : filteredStores.length > 0 ? (
            filteredStores.map(store => (
              <StoreCard key={store._id} store={store} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No stores found matching your search.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoresList;
