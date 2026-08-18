import { memo } from 'react';
import RatingStars from './RatingStars';

const RatingSummary = memo(({ stats }) => {
  if (!stats) return null;

  const { averageRating, totalReviews, ratingDistribution, recommendationPercentage } = stats;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8">
        <h3 className="text-5xl font-black text-gray-900 mb-2">{averageRating.toFixed(1)}</h3>
        <RatingStars rating={averageRating} size={24} />
        <p className="text-gray-500 mt-2 text-sm">{totalReviews} Verified Reviews</p>
        <div className="mt-4 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>👍</span> {recommendationPercentage}% Recommend
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          
          return (
            <div key={star} className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 w-16 font-medium text-gray-700">
                <span>{star}</span>
                <span className="text-yellow-400">★</span>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-right text-gray-500">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

RatingSummary.displayName = 'RatingSummary';
export default RatingSummary;
