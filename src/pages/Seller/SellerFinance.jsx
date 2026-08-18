import { useState, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiCreditCard, FiDollarSign, FiClock, FiDownload, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerFinance = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getFinance();
      if (res.success) {
        setFinanceData(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch finance data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      const res = await sellerService.requestWithdrawal({ amount: Number(withdrawAmount) });
      if (res.success) {
        toast.success(`Withdrawal request for Rs. ${withdrawAmount} submitted`);
        setWithdrawAmount('');
        fetchFinance(); // Refresh
      }
    } catch (error) {
      toast.error('Failed to request withdrawal');
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
            <FiCreditCard className="text-[#ff6a00] shrink-0" /> Finance & Payouts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your wallet, request withdrawals, and view payout history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 sm:p-6 rounded-2xl text-white shadow-lg relative overflow-hidden min-w-0">
          <div className="relative z-10 w-full">
            <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">Available Balance</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 truncate">Rs. {(financeData?.available || 0).toLocaleString()}</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input 
                type="number" 
                placeholder="Amount" 
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 w-full text-sm outline-none flex-1 min-w-0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <button onClick={handleWithdraw} className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto shrink-0">
                Withdraw
              </button>
            </div>
          </div>
          <FiDollarSign className="absolute -right-6 -bottom-6 text-8xl text-white/5 pointer-events-none" />
        </div>

        <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-3 mb-2 min-w-0">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0"><FiClock /></div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider truncate">Pending Clearance</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 truncate">Rs. {(financeData?.pending || 0).toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2 line-clamp-2">Funds from recent sales clearing in 3-5 days.</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-3 mb-2 min-w-0">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0"><FiCreditCard /></div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider truncate">Total Withdrawn</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 truncate">Rs. {(financeData?.total || 0).toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2 line-clamp-2">Lifetime earnings successfully transferred.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0 w-full">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center min-w-0">
          <h3 className="font-black text-gray-900 text-base sm:text-lg truncate">Payout History</h3>
          <button className="text-[10px] sm:text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 shrink-0">
            <FiDownload /> <span className="hidden sm:inline">Export CSV</span><span className="sm:hidden">Export</span>
          </button>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-[10px] sm:text-sm min-w-full">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Payout ID</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Date</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Amount</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Method</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {financeData?.payouts?.map(pay => (
                <tr key={pay._id || pay.id} className="hover:bg-gray-50">
                  <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">{pay._id || pay.id}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">{new Date(pay.date || Date.now()).toLocaleDateString()}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 font-black text-gray-900 whitespace-normal sm:whitespace-nowrap">Rs. {pay.amount?.toLocaleString()}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">{pay.method || 'Bank Transfer'}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      pay.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!financeData?.payouts || financeData.payouts.length === 0) && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No payout history found.
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

export default SellerFinance;
