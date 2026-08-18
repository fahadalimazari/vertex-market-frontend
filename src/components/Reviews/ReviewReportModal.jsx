import { useState } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { useReviews } from '../../hooks/useReviews';
import { useDashboard } from '../../context/Dashboard/DashboardContext';

const ReviewReportModal = ({ review, onClose }) => {
  const { reportReview } = useReviews();
  const { user } = useDashboard();
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { id: 'spam', label: 'Spam or Advertising' },
    { id: 'fake', label: 'Fake Review' },
    { id: 'abusive', label: 'Abusive Language or Hate Speech' },
    { id: 'wrong_product', label: 'Review is for a different product' },
    { id: 'copyright', label: 'Copyright Violation' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;
    
    setIsSubmitting(true);
    await reportReview({
      reviewId: review.id,
      userId: user?.id || 'mock-user',
      reason,
      comments
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900">
            <FiAlertTriangle className="text-red-500" size={20} />
            <h3 className="font-bold text-lg">Report Review</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-3">Why are you reporting this review?</label>
            <div className="space-y-3">
              {reportReasons.map((r) => (
                <label key={r.id} className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="radio" 
                      name="reportReason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-[#ff6a00] transition-colors"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-[#ff6a00] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-2">Additional Comments (Optional)</label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide more details to help us investigate..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!reason || isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Reporting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewReportModal;
