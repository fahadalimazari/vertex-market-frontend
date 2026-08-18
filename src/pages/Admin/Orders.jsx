import { useState, useMemo } from 'react';
import { useOrderManagement } from '../../context/Admin/OrderManagementContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSearch, FiSliders, FiClock, FiCheck, FiPrinter, FiX, FiDollarSign } from 'react-icons/fi';

const Orders = () => {
  const { orders, updateOrderStatus, refundOrder, printInvoice } = useOrderManagement();
  const { addLog } = useLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleUpdateStatus = (id, nextStatus) => {
    updateOrderStatus(id, nextStatus);
    addLog('Order Updated', `Updated order #${id} fulfillment status to: ${nextStatus}`);
  };

  const handleRefund = (id, total) => {
    if (window.confirm(`Initiate refund processing of Rs. ${total.toLocaleString()} for Order #${id}?`)) {
      refundOrder(id);
      addLog('Refund Processed', `Issued refund transaction for Order #${id} (Rs. ${total.toLocaleString()})`);
    }
  };

  const handlePrint = (id) => {
    printInvoice(id);
    addLog('Invoice Printed', `Dispatched PDF invoice printer queue for Order #${id}`);
  };

  // Filter list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  const getNextAction = (status) => {
    switch (status) {
      case 'Pending':
        return { label: 'Confirm Order', next: 'Confirmed' };
      case 'Confirmed':
        return { label: 'Pack Item', next: 'Packed' };
      case 'Packed':
        return { label: 'Ship Package', next: 'Shipped' };
      case 'Shipped':
        return { label: 'Mark Delivered', next: 'Delivered' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Multi-Vendor Orders Management</h2>
        <p className="text-xs text-gray-500 mt-1">Review transactional order fulfillments, override statuses, or issue refunds.</p>
      </div>

      {/* Advanced search & filters block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <div className="sm:col-span-2 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs w-full bg-gray-50/20"
            placeholder="Search orders by customer or Order ID..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs bg-white text-gray-700 font-semibold"
          >
            <option value="all">Status: All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vendor Store</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-755">
              {filteredOrders.map((order) => {
                const action = getNextAction(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                    {/* Order ID */}
                    <td className="p-4 pl-6">
                      <p className="font-bold text-gray-900">{order.id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.date).toLocaleDateString()}</p>
                    </td>

                    {/* Customer */}
                    <td className="p-4 text-gray-800">{order.customer}</td>

                    {/* Vendor */}
                    <td className="p-4 text-gray-500 font-semibold">{order.sellerStore}</td>

                    {/* Total Amount */}
                    <td className="p-4 font-bold text-gray-900">Rs. {order.total.toLocaleString()}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                        order.status === 'Delivered' 
                          ? 'bg-green-50 text-green-600' 
                          : order.status === 'Refunded' 
                            ? 'bg-red-50 text-red-500'
                            : 'bg-orange-50 text-orange-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        {action && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, action.next)}
                            className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm"
                          >
                            {action.label}
                          </button>
                        )}

                        <button
                          onClick={() => handlePrint(order.id)}
                          className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-650 rounded-lg border border-gray-100"
                          title="Print Invoice"
                        >
                          <FiPrinter className="h-4 w-4" />
                        </button>

                        {order.status === 'Delivered' && (
                          <button
                            onClick={() => handleRefund(order.id, order.total)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-450 hover:text-red-600 transition-colors"
                            title="Process Payout Refund"
                          >
                            <FiDollarSign className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
