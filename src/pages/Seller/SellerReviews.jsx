import { useEffect, useState, useMemo } from 'react';
import { useReviews } from '../../hooks/useReviews';
import { useSeller } from '../../context/SellerContext';
import { FiStar, FiMessageCircle, FiTrendingUp, FiTrendingDown, FiCornerDownRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerReviews = () => {
  const { currentStore } = useSeller();
  const { reviews, replyToReview } = useReviews();
  const [sellerReviews, setSellerReviews] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);

  // Mock seller ID
  const sellerId = currentStore?.id || 'SEL-001';

  useEffect(() => {
    // In real app, we would fetch seller specific reviews: reviewService.getReviewsBySeller(sellerId)
    setSellerReviews(reviews.filter(r => r.sellerId === sellerId));
  }, [reviews, sellerId]);

  // Analytics Calculation
  const analytics = useMemo(() => {
    if (!sellerReviews.length) return null;
    
    let sum = 0;
    let positive = 0;
    let negative = 0;

    sellerReviews.forEach(r => {
      sum += r.rating;
      if (r.rating >= 4) positive++;
      if (r.rating <= 2) negative++;
    });

    return {
      average: (sum / sellerReviews.length).toFixed(1),
      total: sellerReviews.length,
      positivePercent: Math.round((positive / sellerReviews.length) * 100),
      negativePercent: Math.round((negative / sellerReviews.length) * 100),
    };
  }, [sellerReviews]);

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      await replyToReview(reviewId, sellerId, currentStore?.name || 'Seller Store', replyText);
      setActiveReplyId(null);
      setReplyText('');
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Reviews</h2>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
              <FiStar size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.average}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <FiMessageCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.total}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Positive Reviews</p>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.positivePercent}%</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <FiTrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Negative Reviews</p>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.negativePercent}%</h3>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Customer Reviews</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {sellerReviews.map(review => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{review.userName}</span>
                    <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-200'} size={14} />
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{review.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">Product: {review.productSlug}</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">{review.description}</p>
              
              {review.sellerReply ? (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3">
                  <FiCornerDownRight className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900 mb-1">Your Reply</p>
                    <p className="text-sm text-gray-600">{review.sellerReply.text}</p>
                  </div>
                </div>
              ) : (
                <div>
                  {activeReplyId === review.id ? (
                    <div className="mt-4">
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your official response..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] resize-none text-sm mb-3"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleReply(review.id)}
                          className="px-4 py-2 rounded-xl bg-[#ff6a00] text-white text-sm font-medium hover:bg-[#e65c00]"
                        >
                          Submit Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveReplyId(review.id)}
                      className="text-[#ff6a00] text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      <FiMessageCircle /> Reply to Customer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {sellerReviews.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No reviews received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerReviews;
