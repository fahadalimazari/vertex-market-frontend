import { memo } from 'react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useReviews } from '../../hooks/useReviews';
import { useDashboard } from '../../context/Dashboard/DashboardContext';
import toast from 'react-hot-toast';

const HelpfulButton = memo(({ review }) => {
  const { voteReview } = useReviews();
  const { user } = useDashboard(); // Assuming we get current user id from Dashboard context
  
  // For demo, we use a mock user id if user is not available
  const userId = user?.id || 'mock-user-1';

  // In reality, userVote would come from the context or a local state synced with the context
  // but to prevent excessive re-renders, the ReviewCard passes the review object.
  // We can look up the user's vote from localStorage or assume it's attached.
  
  // For this mock, we fetch local votes directly inside the component
  // to avoid complex global state sync for every single button.
  const getLocalVote = () => {
    try {
      const votes = JSON.parse(localStorage.getItem('vertex_review_votes_v1') || '{}');
      return votes[review.id]?.[userId] || null;
    } catch {
      return null;
    }
  };

  const currentVote = getLocalVote();

  const handleVote = (type) => {
    if (!userId) {
      toast.error('Please login to vote');
      return;
    }
    voteReview(review.id, userId, type);
  };

  return (
    <div className="flex items-center gap-4 text-sm mt-4">
      <span className="text-gray-500">Was this review helpful?</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleVote('helpful')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
            currentVote === 'helpful' 
              ? 'bg-green-50 border-green-200 text-green-700 font-medium' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FiThumbsUp size={14} className={currentVote === 'helpful' ? 'fill-current' : ''} />
          <span>{review.helpfulVotes || 0}</span>
        </button>
        <button 
          onClick={() => handleVote('unhelpful')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
            currentVote === 'unhelpful' 
              ? 'bg-red-50 border-red-200 text-red-700 font-medium' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FiThumbsDown size={14} className={currentVote === 'unhelpful' ? 'fill-current' : ''} />
          <span>{review.unhelpfulVotes || 0}</span>
        </button>
      </div>
    </div>
  );
});

HelpfulButton.displayName = 'HelpfulButton';
export default HelpfulButton;
