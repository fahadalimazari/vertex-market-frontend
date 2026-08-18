import { useState } from 'react';
import { usePromotions } from '../../hooks/usePromotions';
import VoucherCard from '../../components/Promotions/VoucherCard';
import { FiGift, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const VoucherWallet = () => {
  const { collectedVouchers, removeVoucher } = usePromotions();
  const [filter, setFilter] = useState('active'); // active, expired

  const filteredVouchers = collectedVouchers.filter(v => {
    if (filter === 'active') return v.status === 'active';
    if (filter === 'expired') return v.status !== 'active';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiGift className="text-[#ff6a00]" /> My Voucher Wallet
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your collected vouchers and store discounts.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === 'expired' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Vouchers
          </button>
        </div>
      </div>

      {filteredVouchers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVouchers.map(voucher => (
            <VoucherCard 
              key={voucher.id} 
              voucher={voucher} 
              isCollected={true}
              onRemove={() => removeVoucher(voucher.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <FiAlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Vouchers Found</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            {filter === 'active' 
              ? "You haven't collected any vouchers yet. Visit the Promotions page to find amazing deals!"
              : "You don't have any expired or used vouchers."}
          </p>
          <Link 
            to="/promotions"
            className="bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Find Deals
          </Link>
        </div>
      )}
    </div>
  );
};

export default VoucherWallet;
