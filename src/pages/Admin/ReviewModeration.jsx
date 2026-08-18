import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTrash2, FiRefreshCcw, FiAlertTriangle, FiEyeOff } from 'react-icons/fi';
import { useReviews } from '../../hooks/useReviews';
import { initialReviewReports } from '../../data/reviews';
import toast from 'react-hot-toast';

const ReviewModeration = () => {
  const { allReviews, deleteReview, isLoading } = useReviews();
  const [activeTab, setActiveTab] = useState('all'); // all, pending, reported, deleted
  const [reports, setReports] = useState([]);
  
  // Local state to simulate admin modifying review status
  const [adminReviews, setAdminReviews] = useState([]);

  useEffect(() => {
    setAdminReviews(allReviews);
    // In real app, we fetch reports via reviewService.getReports()
    const storedReports = localStorage.getItem('vertex_review_reports_v1');
    setReports(storedReports ? JSON.parse(storedReports) : initialReviewReports);
  }, [allReviews]);

  const handleStatusChange = (reviewId, newStatus) => {
    setAdminReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
    toast.success(`Review marked as ${newStatus}`);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to permanently delete this review?')) {
      try {
        await deleteReview(reviewId, null); // null userId signifies admin override
        toast.success('Review permanently deleted');
      } catch (err) {
        // error handled by context
      }
    }
  };

  const resolveReport = (reportId, action) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
    toast.success(`Report resolved: ${action}`);
  };

  const getFilteredData = () => {
    if (activeTab === 'all') return adminReviews.filter(r => r.status !== 'deleted');
    if (activeTab === 'reported') {
      const reportedReviewIds = reports.filter(r => r.status === 'pending').map(r => r.reviewId);
      return adminReviews.filter(r => reportedReviewIds.includes(r.id));
    }
    return adminReviews.filter(r => r.status === activeTab);
  };

  const displayedReviews = getFilteredData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Moderation</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Reviews' },
          { id: 'pending', label: 'Pending Approval' },
          { id: 'reported', label: 'Reported' },
          { id: 'hidden', label: 'Hidden' },
          { id: 'deleted', label: 'Deleted' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-sm text-gray-900">Review Info</th>
                <th className="p-4 font-bold text-sm text-gray-900">Product / Seller</th>
                <th className="p-4 font-bold text-sm text-gray-900">Status</th>
                {activeTab === 'reported' && <th className="p-4 font-bold text-sm text-gray-900">Report Reason</th>}
                <th className="p-4 font-bold text-sm text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedReviews.map(review => {
                const report = activeTab === 'reported' ? reports.find(r => r.reviewId === review.id && r.status === 'pending') : null;
                
                return (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">{review.userName}</span>
                        <span className="text-yellow-400 text-xs flex items-center">★ {review.rating}</span>
                      </div>
                      <p className="font-medium text-sm text-gray-900">{review.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">{review.description}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-[#ff6a00] font-medium">{review.productSlug}</p>
                      <p className="text-xs text-gray-500 mt-1">{review.sellerId}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        review.status === 'approved' ? 'bg-green-50 text-green-600' :
                        review.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                        review.status === 'hidden' ? 'bg-orange-50 text-orange-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    {activeTab === 'reported' && (
                      <td className="p-4">
                        {report ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                              <FiAlertTriangle /> {report.reason}
                            </span>
                            {report.comments && <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{report.comments}</p>}
                          </div>
                        ) : '-'}
                      </td>
                    )}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'reported' ? (
                          <>
                            <button onClick={() => { handleStatusChange(review.id, 'hidden'); resolveReport(report?.id, 'resolved_hidden'); }} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100" title="Hide Review">
                              <FiEyeOff size={16} />
                            </button>
                            <button onClick={() => resolveReport(report?.id, 'dismissed')} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Dismiss Report">
                              <FiCheck size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            {review.status !== 'approved' && (
                              <button onClick={() => handleStatusChange(review.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Approve">
                                <FiCheck size={16} />
                              </button>
                            )}
                            {review.status !== 'hidden' && review.status !== 'deleted' && (
                              <button onClick={() => handleStatusChange(review.id, 'hidden')} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100" title="Hide">
                                <FiEyeOff size={16} />
                              </button>
                            )}
                            {review.status === 'deleted' ? (
                              <button onClick={() => handleStatusChange(review.id, 'approved')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Restore">
                                <FiRefreshCcw size={16} />
                              </button>
                            ) : (
                              <button onClick={() => handleDelete(review.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete">
                                <FiTrash2 size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {displayedReviews.length === 0 && (
                <tr>
                  <td colSpan={activeTab === 'reported' ? 5 : 4} className="p-8 text-center text-gray-500">
                    No reviews found in this queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewModeration;
