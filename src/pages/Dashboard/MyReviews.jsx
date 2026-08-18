import { useEffect, useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import { useDashboard } from '../../context/Dashboard/DashboardContext';
import { FiStar, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import EditReviewModal from '../../components/Reviews/EditReviewModal';
import DeleteReviewModal from '../../components/Reviews/DeleteReviewModal';

const MyReviews = () => {
  const { user } = useDashboard();
  const { reviews, deleteReview } = useReviews();
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (user?.id) {
      // In a real app we'd fetch via loadUserReviews(user.id)
      setUserReviews(reviews.filter(r => r.userId === user.id || r.userId === 'mock-user' || r.userId === 'U-001'));
    }
  }, [reviews, user]);

  const handleDeleteConfirm = async () => {
    if (deletingReviewId) {
      await deleteReview(deletingReviewId, user?.id || 'mock-user');
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>

      {userReviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userReviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <button 
                  onClick={() => setEditingReview(review)}
                  className="text-gray-400 hover:text-[#ff6a00] p-2 bg-gray-50 rounded-full transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button 
                  onClick={() => setDeletingReviewId(review.id)}
                  className="text-gray-400 hover:text-red-600 p-2 bg-gray-50 rounded-full transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="pr-20">
                <Link to={`/product/${review.productSlug}`} className="text-[#ff6a00] hover:underline font-bold text-sm mb-2 inline-block">
                  {review.productSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Link>
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                  ))}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{review.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{review.description}</p>
                <div className="text-xs text-gray-400 mt-4">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingReview && (
        <EditReviewModal 
          review={editingReview} 
          onClose={() => setEditingReview(null)} 
        />
      )}

      {deletingReviewId && (
        <DeleteReviewModal 
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingReviewId(null)}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default MyReviews;
