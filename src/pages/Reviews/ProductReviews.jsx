import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useReviews } from '../../hooks/useReviews';
import RatingSummary from '../../components/Reviews/RatingSummary';
import ReviewFilters from '../../components/Reviews/ReviewFilters';
import ReviewSort from '../../components/Reviews/ReviewSort';
import ReviewGrid from '../../components/Reviews/ReviewGrid';
import ReviewsSkeleton from '../../components/Reviews/ReviewsSkeleton';
import WriteReviewModal from '../../components/Reviews/WriteReviewModal';
import ReviewReportModal from '../../components/Reviews/ReviewReportModal';

const ProductReviews = () => {
  const { slug } = useParams();
  const { loadProductReviews, productStats, isLoading, canUserReviewProduct } = useReviews();

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [reportReview, setReportReview] = useState(null);
  
  // To avoid having to fetch the product details again just for basic info, we simulate it
  const productInfo = {
    id: `P-${Math.floor(Math.random() * 1000)}`,
    slug: slug,
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    sellerId: `SEL-${Math.floor(Math.random() * 100)}`
  };

  useEffect(() => {
    if (slug) {
      loadProductReviews(slug);
    }
  }, [slug, loadProductReviews]);

  const canReview = canUserReviewProduct(slug);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/product/${slug}`} 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 font-medium"
          >
            <FiArrowLeft /> Back to Product
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Customer Reviews</h1>
              <p className="text-gray-500 mt-1">for {productInfo.name}</p>
            </div>
            {canReview && (
              <button 
                onClick={() => setIsWriteModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#ff6a00] text-white font-bold hover:bg-[#e65c00] transition-colors whitespace-nowrap"
              >
                Write a Review
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <ReviewsSkeleton />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar: Filters & Summary */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <RatingSummary stats={productStats} />
              <ReviewFilters />
            </div>

            {/* Main Content: Sort & Grid */}
            <div className="flex-1">
              <ReviewSort />
              <ReviewGrid 
                onReport={(review) => setReportReview(review)}
                onWriteReview={() => setIsWriteModalOpen(true)}
                canReview={canReview}
              />
            </div>
          </div>
        )}
      </div>

      {isWriteModalOpen && (
        <WriteReviewModal 
          productId={productInfo.id}
          productSlug={productInfo.slug}
          sellerId={productInfo.sellerId}
          onClose={() => setIsWriteModalOpen(false)}
        />
      )}

      {reportReview && (
        <ReviewReportModal 
          review={reportReview}
          onClose={() => setReportReview(null)}
        />
      )}
    </div>
  );
};

export default ProductReviews;
