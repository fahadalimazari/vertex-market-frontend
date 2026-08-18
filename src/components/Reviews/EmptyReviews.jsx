import { FiMessageCircle } from 'react-icons/fi';

const EmptyReviews = ({ onWriteReview, canReview }) => {
  return (
    <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
        <FiMessageCircle size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Be the first to review this product and help others make an informed decision.
      </p>
      
      {canReview ? (
        <button 
          onClick={onWriteReview}
          className="px-8 py-3 rounded-xl bg-[#ff6a00] text-white font-bold hover:bg-[#e65c00] transition-colors"
        >
          Write a Review
        </button>
      ) : (
        <p className="text-sm text-gray-400 italic">
          Only customers who have purchased and received this item can write a review.
        </p>
      )}
    </div>
  );
};

export default EmptyReviews;
