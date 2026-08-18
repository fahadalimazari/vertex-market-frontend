import { useState } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { FiTrendingUp, FiCreditCard, FiClock, FiPlusCircle, FiCheck, FiAlertCircle } from 'react-icons/fi';

const SellerEarnings = () => {
  const { earnings, requestWithdrawal } = useAnalytics();
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState('');
  
  const [bankInfo, setBankInfo] = useState({
    bankName: 'Habib Bank Limited',
    accountNumber: '100234582312'
  });

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const success = requestWithdrawal(withdrawAmt, bankInfo);
    if (success) {
      setWithdrawAmt('');
      setShowWithdrawForm(false);
    }
  };

  const getTxnTypeLabel = (type) => {
    switch (type) {
      case 'withdrawal':
        return 'Payout Payout';
      case 'order_sale':
      default:
        return 'Sale Earnings';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Earnings Ledger</h2>
          <p className="text-xs text-gray-500 mt-1">Review payouts, transaction history, and request withdrawals.</p>
        </div>
        <button
          onClick={() => setShowWithdrawForm(true)}
          className="flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <FiPlusCircle className="h-4 w-4" />
          <span>Request Withdrawal</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Balance</p>
          <h3 className="text-xl font-black text-gray-900">Rs. {earnings.available.toLocaleString()}</h3>
          <p className="text-[10px] text-green-600 font-bold uppercase">Ready to withdraw</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Withdrawn to Bank</p>
          <h3 className="text-xl font-black text-gray-900">Rs. {earnings.withdrawn.toLocaleString()}</h3>
          <p className="text-[10px] text-gray-500 font-semibold">Credited to account</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Balance</p>
          <h3 className="text-xl font-black text-gray-900">Rs. {earnings.pending.toLocaleString()}</h3>
          <p className="text-[10px] text-orange-500 font-bold uppercase">Fulfillment escrow</p>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-w-0 w-full">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 whitespace-normal sm:whitespace-nowrap">Transaction ID</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Type</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Description</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Amount</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Status</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {earnings.transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 font-mono font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">{txn.id}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 uppercase tracking-wider font-bold text-[10px] text-gray-500 whitespace-normal sm:whitespace-nowrap">
                    {getTxnTypeLabel(txn.type)}
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">{txn.description}</td>
                  <td className={`px-1 sm:px-4 py-2 sm:py-4 font-bold whitespace-normal sm:whitespace-nowrap ${
                    txn.type === 'withdrawal' ? 'text-red-500' : 'text-[#ff6a00]'
                  }`}>
                    {txn.type === 'withdrawal' ? '-' : '+'} Rs. {txn.amount.toLocaleString()}
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      txn.status === 'completed' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-orange-50 text-orange-500 animate-pulse'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-400 whitespace-normal sm:whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {earnings.transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowWithdrawForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1"
            >
              x
            </button>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Request Withdrawal</h3>
            <p className="text-xs text-gray-500 mb-4">Transfer available funds to your linked bank account.</p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Amount to Withdraw (Rs.)
                </label>
                <input
                  type="number"
                  required
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  placeholder="Max: Rs. 184,500"
                  max={earnings.available}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
                />
              </div>

              <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl text-xs space-y-1">
                <p className="font-bold text-gray-900">Destination Account:</p>
                <p className="text-gray-500">Bank: {bankInfo.bankName}</p>
                <p className="text-gray-500">Account: **** **** {bankInfo.accountNumber.substr(-4)}</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Confirm Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerEarnings;
