import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { FiDollarSign, FiSearch } from 'react-icons/fi';
import RefundCard from '../../components/Orders/RefundCard';
import EmptyOrders from '../../components/Orders/EmptyOrders';

const Refunds = () => {
  const { refunds } = useOrders();
  const [search, setSearch] = useState('');

  const filtered = refunds.filter(r => r.id.toLowerCase().includes(search.toLowerCase()) || r.orderId.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#ff6a00]/10 text-[#ff6a00] flex items-center justify-center rounded-xl">
                <FiDollarSign className="text-xl" />
              </span>
              Refunds History
            </h1>
            <p className="text-gray-500 mt-1">Track the status of your requested refunds.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Order or Refund ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map(refund => (
              <RefundCard key={refund.id} refund={refund} />
            ))
          ) : (
            <EmptyOrders message="No refunds found. You haven't requested any refunds." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Refunds;
