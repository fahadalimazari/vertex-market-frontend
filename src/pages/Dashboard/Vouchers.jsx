import { useState, useEffect } from 'react';
import { couponService } from '../../services/api/couponService';
import VoucherCard from '../../components/Dashboard/Vouchers/VoucherCard';
import toast from 'react-hot-toast';
import { FiTag } from 'react-icons/fi';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setIsLoading(true);
        const data = await couponService.getMyVouchers();
        setVouchers(data);
      } catch (error) {
        toast.error('Unable to load vouchers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const filteredVouchers = vouchers.filter(v => {
    if (activeTab === 'All') return true;
    return v.status === activeTab;
  });

  const getCount = (status) => {
    if (status === 'All') return vouchers.length;
    return vouchers.filter(v => v.status === status).length;
  };

  const tabs = ['All', 'Available', 'Used', 'Expired'];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiTag className="text-[#ff6a00]" />
          My Vouchers
        </h2>
        <p className="text-[14px] text-gray-500 mt-1">Manage and apply your exclusive discounts.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-[14px] rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'text-[#ff6a00] border-b-2 border-[#ff6a00] bg-orange-50/50' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab} <span className="ml-1 opacity-60">({getCount(tab)})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl h-48 p-5">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 mt-6">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FiTag className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} vouchers found</h3>
          <p className="text-[14px] text-gray-500 max-w-sm mx-auto">
            You don't have any vouchers in this category right now. Keep shopping to unlock new rewards!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVouchers.map(voucher => (
            <VoucherCard key={voucher._id} voucher={voucher} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vouchers;
