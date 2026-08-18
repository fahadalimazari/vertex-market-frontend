import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviews } from '../../hooks/useReviews';
import { useAI } from '../../context/AIContext';
import RatingSummary from '../Reviews/RatingSummary';
import ReviewCard from '../Reviews/ReviewCard';
import EmptyReviews from '../Reviews/EmptyReviews';
import ReviewsSkeleton from '../Reviews/ReviewsSkeleton';
import WriteReviewModal from '../Reviews/WriteReviewModal';
import { FiMessageSquare, FiTrendingUp, FiThumbsUp, FiList } from 'react-icons/fi';

const ProductReviewsSection = ({ product }) => {
  const { loadProductReviews, reviews, productStats, isLoading, canUserReviewProduct } = useReviews();
  const { setMessages, setIsOpen } = useAI();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  useEffect(() => {
    if (product?.slug) {
      loadProductReviews(product.slug);
    }
  }, [product?.slug, loadProductReviews]);

  const canReview = canUserReviewProduct(product?.slug);
  const latestReviews = reviews.slice(0, 5);

  const handleAIPrompt = (promptText) => {
    setIsOpen(true);
    setMessages(prev => [
      ...prev,
      { role: 'user', content: `${promptText} for ${product.name}` }
    ]);
  };

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  return (
    <div className="space-y-8 mt-12 border-t border-gray-100 pt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Customer Reviews</h2>
          <p className="text-gray-500">Based on verified purchases</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/product/${product?.slug}/reviews`}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 transition-colors"
          >
            View All
          </Link>
          {canReview && (
            <button 
              onClick={() => setIsWriteModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-[#ff6a00] text-white font-bold hover:bg-[#e65c00] transition-colors"
            >
              Write Review
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <RatingSummary stats={productStats} />
          
          {/* AI Quick Actions */}
          <div className="bg-gradient-to-br from-[#ff6a00]/5 to-orange-50 rounded-2xl p-6 border border-[#ff6a00]/10">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span> AI Review Assistant
            </h4>
            <div className="space-y-2">
              <button onClick={() => handleAIPrompt('Summarize customer reviews')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-sm font-medium text-gray-700 hover:text-[#ff6a00] hover:shadow-sm transition-all text-left">
                <FiMessageSquare className="text-[#ff6a00]" /> Summarize Reviews
              </button>
              <button onClick={() => handleAIPrompt('What are the pros and cons based on reviews?')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-sm font-medium text-gray-700 hover:text-[#ff6a00] hover:shadow-sm transition-all text-left">
                <FiList className="text-[#ff6a00]" /> Pros & Cons
              </button>
              <button onClick={() => handleAIPrompt('What are the common complaints in the reviews?')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-sm font-medium text-gray-700 hover:text-[#ff6a00] hover:shadow-sm transition-all text-left">
                <FiMessageSquare className="text-[#ff6a00]" /> Common Complaints
              </button>
              <button onClick={() => handleAIPrompt('Based on reviews, is this product a buying recommendation?')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-sm font-medium text-gray-700 hover:text-[#ff6a00] hover:shadow-sm transition-all text-left">
                <FiThumbsUp className="text-[#ff6a00]" /> Buying Recommendation
              </button>
              <button onClick={() => handleAIPrompt('Compare customer opinions from the reviews')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-sm font-medium text-gray-700 hover:text-[#ff6a00] hover:shadow-sm transition-all text-left">
                <FiTrendingUp className="text-[#ff6a00]" /> Compare Customer Opinions
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {latestReviews.length > 0 ? (
            <div className="space-y-6">
              {latestReviews.map(review => (
                <ReviewCard key={review.id} review={review} onReport={() => {}} />
              ))}
              {reviews.length > 5 && (
                <div className="text-center pt-4 border-t border-gray-100">
                  <Link 
                    to={`/product/${product?.slug}/reviews`}
                    className="inline-flex items-center gap-2 font-bold text-[#ff6a00] hover:text-[#e65c00]"
                  >
                    Read all {reviews.length} reviews
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <EmptyReviews onWriteReview={() => setIsWriteModalOpen(true)} canReview={canReview} />
          )}
        </div>
      </div>

      {isWriteModalOpen && (
        <WriteReviewModal 
          productId={product?.id}
          productSlug={product?.slug}
          sellerId="SEL-001" // Mock
          onClose={() => setIsWriteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductReviewsSection;
