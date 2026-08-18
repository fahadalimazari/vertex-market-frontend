import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import TrackingSteps from '../../components/Orders/TrackingSteps';
import { FiSearch, FiTruck } from 'react-icons/fi';

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [trackingId, setTrackingId] = useState(initialId);
  const [timeline, setTimeline] = useState(null);
  const [error, setError] = useState('');
  
  const { trackOrder, isLoading } = useOrders();

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackingId.trim()) return;
    
    setError('');
    setSearchParams({ id: trackingId });
    
    const result = await trackOrder(trackingId);
    if (result) {
      setTimeline(result);
    } else {
      setTimeline(null);
      setError(`No tracking information found for order ID "${trackingId}".`);
    }
  };

  // Auto search if ID in URL
  useEffect(() => {
    if (initialId && !timeline && !error) {
      handleSearch();
    }
  }, [initialId]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3">
            <FiTruck className="text-[#ff6a00]" /> Track Your Package
          </h1>
          <p className="text-gray-600 mt-2">Enter your Order ID below to get real-time tracking updates.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="e.g. ORD-89231"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff6a00] outline-none font-medium text-gray-900 transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !trackingId.trim()}
              className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-8 py-4 rounded-2xl font-black transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          {timeline && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="font-black text-gray-900 mb-6 text-lg">Tracking Timeline</h3>
              <div className="px-4">
                <TrackingSteps timeline={timeline} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
