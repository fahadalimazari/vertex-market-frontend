import { memo } from 'react';
import { useReviews } from '../../hooks/useReviews';
import { FiChevronDown } from 'react-icons/fi';

const ReviewSort = memo(() => {
  const { sort, setSort, allReviews, reviews } = useReviews();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h3 className="text-xl font-bold text-gray-900">
        Showing {reviews.length} of {allReviews.length} Reviews
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
});

ReviewSort.displayName = 'ReviewSort';
export default ReviewSort;
