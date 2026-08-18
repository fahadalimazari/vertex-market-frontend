import { memo } from 'react';
import { useReviews } from '../../hooks/useReviews';

const ReviewFilters = memo(() => {
  const { filter, setFilter } = useReviews();

  const filters = [
    { id: 'all', label: 'All Reviews' },
    { id: '5star', label: '5 Stars' },
    { id: '4star', label: '4 Stars' },
    { id: '3star', label: '3 Stars' },
    { id: '2star', label: '2 Stars' },
    { id: '1star', label: '1 Star' },
    { id: 'withImages', label: 'With Images' },
    { id: 'verified', label: 'Verified Buyers' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
      <h4 className="font-bold text-gray-900 mb-4">Filter Reviews</h4>
      <div className="flex flex-col gap-2">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
              filter === f.id 
                ? 'bg-[#ff6a00]/10 text-[#ff6a00] font-bold' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
});

ReviewFilters.displayName = 'ReviewFilters';
export default ReviewFilters;
