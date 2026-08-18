import { memo, useState } from 'react';
import { FiMoreVertical, FiFlag, FiCheckCircle } from 'react-icons/fi';
import RatingStars from './RatingStars';
import HelpfulButton from './HelpfulButton';
import ReviewImages from './ReviewImages';
import ReviewReply from './ReviewReply';

const ReviewCard = memo(({ review, onReport }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Time ago formatter
  const timeAgo = (dateStr) => {
    const diff = new Date() - new Date(dateStr);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ff6a00] to-[#ff9500] text-white font-bold text-lg">
                {review.isAnonymous ? 'A' : review.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">
                {review.isAnonymous ? 'Anonymous User' : review.userName}
              </h4>
              {review.isVerified && (
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                  <FiCheckCircle size={12} /> Verified Purchase
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <RatingStars rating={review.rating} size={14} />
              <span className="text-xs text-gray-500">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <FiMoreVertical size={18} />
          </button>
          
          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <button 
                  onClick={() => {
                    setShowOptions(false);
                    onReport(review);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiFlag size={14} /> Report Review
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h5 className="font-bold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {review.description}
        </p>
      </div>

      {/* Media */}
      <ReviewImages images={review.images} video={review.video} />

      {/* Actions & Reply */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <HelpfulButton review={review} />
        <ReviewReply reply={review.sellerReply} />
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';
export default memo(ReviewCard);
