import { useState, useEffect } from 'react';
import { useReviews } from '../../context/ReviewContext';
import { FiCheck, FiX, FiTrash2, FiEyeOff, FiRefreshCcw, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const { 
    reviews, 
    reportedReviews, 
    loadAllReviews, 
    loadReportedReviews,
    changeReviewStatus,
    resolveReport
  } = useReviews();

  const [activeTab, setActiveTab] = useState('all'); // all, pending, reported, hidden, deleted
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAllReviews();
    loadReportedReviews();
  }, [loadAllReviews, loadReportedReviews]);

  const handleStatusChange = async (id, status) => {
    if (status === 'deleted' && !window.confirm('Are you sure you want to delete this review?')) return;
    await changeReviewStatus(id, status);
  };

  const filteredReviews = reviews.filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.productSlug.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'all') return r.status !== 'deleted';
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'hidden') return r.status === 'hidden';
    if (activeTab === 'deleted') return r.status === 'deleted';
    if (activeTab === 'reported') return r.status === 'reported';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiMessageSquare className="text-[#ff6a00]" /> Review Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">Approve, hide, or delete customer reviews.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'pending', 'reported', 'hidden', 'deleted'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#ff6a00] text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
          <input 
            type="text" 
            placeholder="Search by title or product..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff6a00] text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Review Info</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map(rev => (
                <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm mb-1">{rev.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{rev.description}</div>
                    <div className="text-[10px] font-bold text-[#ff6a00] mt-1 bg-orange-50 inline-block px-2 py-0.5 rounded">Product: {rev.productSlug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-yellow-400 font-bold bg-gray-50 px-2 py-1 rounded w-fit">
                      ★ {rev.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      rev.status === 'approved' ? 'bg-green-50 text-green-600' :
                      rev.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                      rev.status === 'reported' ? 'bg-red-50 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rev.status !== 'approved' && rev.status !== 'deleted' && (
                        <button onClick={() => handleStatusChange(rev.id, 'approved')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Approve">
                          <FiCheck />
                        </button>
                      )}
                      {rev.status !== 'hidden' && rev.status !== 'deleted' && (
                        <button onClick={() => handleStatusChange(rev.id, 'hidden')} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="Hide">
                          <FiEyeOff />
                        </button>
                      )}
                      {rev.status === 'hidden' && (
                        <button onClick={() => handleStatusChange(rev.id, 'approved')} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Restore">
                          <FiRefreshCcw />
                        </button>
                      )}
                      {rev.status !== 'deleted' && (
                        <button onClick={() => handleStatusChange(rev.id, 'deleted')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No reviews found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeTab === 'reported' && reportedReviews.length > 0 && (
        <div className="bg-red-50/30 rounded-2xl border border-red-100 p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><FiAlertCircle /> Pending Reports Queue</h3>
          <div className="space-y-3">
            {reportedReviews.filter(r => r.status === 'pending').map(report => (
              <div key={report.id} className="bg-white p-4 rounded-xl border border-red-100 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-sm text-gray-900">Review ID: {report.reviewId}</p>
                  <p className="text-xs text-red-600 font-medium">Reason: {report.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">Details: {report.details || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => resolveReport(report.id, 'dismissed')} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">Dismiss</button>
                  <button onClick={() => { handleStatusChange(report.reviewId, 'hidden'); resolveReport(report.id, 'hidden'); }} className="px-3 py-1.5 rounded-lg bg-red-100 text-xs font-bold text-red-700 hover:bg-red-200">Hide Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
