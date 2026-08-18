import { memo, useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import EmptyReviews from './EmptyReviews';
import { useReviews } from '../../hooks/useReviews';

const ReviewGrid = memo(({ onReport, onWriteReview, canReview }) => {
  const { reviews } = useReviews();
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setDisplayedReviews(reviews.slice(0, itemsPerPage));
    setPage(1);
  }, [reviews]);

  const loadMore = () => {
    const next = page + 1;
    const startIndex = 0;
    const endIndex = next * itemsPerPage;
    setDisplayedReviews(reviews.slice(startIndex, endIndex));
    setPage(next);
  };

  if (!reviews || reviews.length === 0) {
    return <EmptyReviews onWriteReview={onWriteReview} canReview={canReview} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedReviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            onReport={onReport}
          />
        ))}
      </div>
      
      {displayedReviews.length < reviews.length && (
        <div className="mt-8 text-center">
          <button 
            onClick={loadMore}
            className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
});

ReviewGrid.displayName = 'ReviewGrid';
export default ReviewGrid;
