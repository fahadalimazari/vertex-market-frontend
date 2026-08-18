import React, { useState, useMemo } from 'react';
import { FiStar, FiMessageCircle, FiX } from 'react-icons/fi';
import { useReviews } from '../../../hooks/useReviews';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReviewsSection = ({ product }) => {
  const { reviews: productCustomReviews, submitReview: addCustomReview, loadProductReviews } = useReviews();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (product?.slug) {
      loadProductReviews(product.slug);
    }
  }, [product?.slug, loadProductReviews]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlreadyReviewedModalOpen, setIsAlreadyReviewedModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('Most Helpful');
  const totalReviews = (product.reviews || 0) + productCustomReviews.length;
  
  const currentAvgRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const baseTotal = (product.rating || 0) * (product.reviews || 0);
    const customTotal = productCustomReviews.reduce((sum, r) => sum + r.rating, 0);
    return ((baseTotal + customTotal) / totalReviews).toFixed(1);
  }, [product, productCustomReviews, totalReviews]);

  // Distribution calculation (mocking the base + custom)
  const distribution = useMemo(() => {
    if (totalReviews === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
    
    // Distribute base reviews reasonably if we don't have actual raw data for them
    const baseCount = product.reviews || 0;
    const dist = {
      5: Math.floor(baseCount * 0.7),
      4: Math.floor(baseCount * 0.2),
      3: Math.floor(baseCount * 0.05),
      2: Math.floor(baseCount * 0.03),
      1: baseCount - Math.floor(baseCount * 0.98)
    };

    // Add custom actuals
    productCustomReviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
      }
    });

    return dist;
  }, [product.reviews, productCustomReviews, totalReviews]);

  const sortedReviews = useMemo(() => {
    const list = [...productCustomReviews];
    if (sortOrder === 'Most Recent') {
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sortOrder === 'Highest Rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortOrder === 'Lowest Rating') {
      return list.sort((a, b) => a.rating - b.rating);
    }
    // Most Helpful
    return list.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
  }, [productCustomReviews, sortOrder]);

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.slug}` } });
      return;
    }
    
    // Check if already reviewed (mock logic checking customReviews)
    if (productCustomReviews.some(r => r.userId === user?._id)) {
      setIsAlreadyReviewedModalOpen(true);
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    if (!reviewText.trim()) {
      setError('Please write a review.');
      return;
    }

    try {
      await addCustomReview({
        productId: product._id,
        productSlug: product.slug,
        userId: user?._id || 'guest',
        userName: user?.name || 'Customer',
        rating,
        title: reviewTitle,
        description: reviewText, // updated field name
        isVerified: true
      });

      setIsModalOpen(false);
      setRating(0);
      setReviewTitle('');
      setReviewText('');
    } catch (err) {
      setError(err.message || 'Error submitting review');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm mb-6">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Rating Summary */}
        <div className="md:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100 h-max">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-black text-gray-900">{currentAvgRating}</span>
            <div>
              <div className="flex text-yellow-400 text-lg mb-1">
                {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.round(currentAvgRating) ? 'fill-current' : 'text-gray-300'} />)}
              </div>
              <div className="text-xs font-medium text-gray-500">Based on {totalReviews} reviews</div>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map(star => {
              const count = distribution[star] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <span className="w-6">{star} ★</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="w-8 text-right text-gray-400">{percentage}%</span>
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleWriteReviewClick}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
          >
            Write a Review
          </button>
        </div>
        
        {/* Review List Space */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-gray-900">Most Helpful Reviews</h3>
            {totalReviews > 0 && (
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 outline-none"
              >
                <option>Most Helpful</option>
                <option>Most Recent</option>
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
              </select>
            )}
          </div>

          {sortedReviews.length === 0 ? (
             <div className="text-center py-16 text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
             <FiMessageCircle className="text-4xl mx-auto mb-3 opacity-20" />
             <h3 className="text-base font-bold text-gray-900 mb-1">No Reviews Yet</h3>
             <p className="text-xs">Be the first to review this product and help others.</p>
           </div>
          ) : (
            <div className="space-y-6">
              {sortedReviews.map(review => (
                <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{review.userName}</h4>
                      <div className="flex text-yellow-400 text-xs mt-1">
                        {[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                  </div>
                  {review.title && <h5 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h5>}
                  <p className="text-sm text-gray-600">{review.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Write a Review</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Rating <span className="text-red-500">*</span></label>
                <div className="flex gap-1 text-2xl text-yellow-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star}
                      className={star <= (hoverRating || rating) ? 'fill-current' : 'text-gray-200'}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Review Title (Optional)</label>
                <input 
                  type="text" 
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Review <span className="text-red-500">*</span></label>
                <textarea 
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all h-32 resize-none"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Already Reviewed Modal */}
      {isAlreadyReviewedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-fadeIn text-center">
            <div className="p-8">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="text-3xl" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">You've Already Reviewed This Product</h3>
              <p className="text-sm text-gray-600 mb-8">
                You have already submitted a review for this product. Thank you for sharing your experience.
              </p>
              <button 
                onClick={() => setIsAlreadyReviewedModalOpen(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
