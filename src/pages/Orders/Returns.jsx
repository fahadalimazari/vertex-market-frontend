import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { FiRotateCcw, FiSearch } from 'react-icons/fi';
import OrderCard from '../../components/Orders/OrderCard';
import EmptyOrders from '../../components/Orders/EmptyOrders';

const Returns = () => {
  const { returns, orders } = useOrders();
  const [search, setSearch] = useState('');

  // Map returns to their full order objects for display
  const returnedOrders = returns.map(ret => {
    const order = orders.find(o => o.id === ret.orderId);
    return order ? { ...order, status: ret.status } : null;
  }).filter(Boolean);

  const filtered = returnedOrders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <FiRotateCcw className="text-[#ff6a00]" /> Returns Center
            </h1>
            <p className="text-gray-500 mt-1">Track the status of your returned items.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyOrders message="No returns found. You haven't requested any returns yet." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Returns;
