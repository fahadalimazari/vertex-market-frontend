import { useState, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiRotateCcw, FiSearch, FiFilter, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getReturns();
      if (res.success) {
        setReturns(res.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await sellerService.updateReturnStatus(id, status);
      if (res.success) {
        toast.success(`Return request marked as ${status}`);
        setReturns(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-[#ff6a00]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiRotateCcw className="text-[#ff6a00] shrink-0" /> Returns Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage customer return requests and refunds.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 w-full min-w-0">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search return ID or Order ID..." className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none" />
          </div>
          <button className="px-4 py-2 border rounded-xl text-sm font-bold flex items-center justify-center gap-1 sm:p-2 hover:bg-gray-50 w-full sm:w-auto shrink-0">
            <FiFilter /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-[10px] sm:text-sm min-w-full">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Return ID</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Order ID</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Product</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Reason</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Status</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returns.map(req => (
                <tr key={req._id || req.id} className="hover:bg-gray-50">
                  <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">{req._id || req.id}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">{req.orderId}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-800 font-semibold">{req.product}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600">{req.reason}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      req.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4">
                    {req.status === 'Pending' && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleUpdateStatus(req._id || req.id, 'Approved')} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg shrink-0" title="Approve">
                          <FiCheck />
                        </button>
                        <button onClick={() => handleUpdateStatus(req._id || req.id, 'Rejected')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg shrink-0" title="Reject">
                          <FiX />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {returns.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No return requests found.
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

export default SellerReturns;
