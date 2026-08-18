import { useState, useMemo, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiShoppingCart, FiClock, FiCheck, FiPrinter, FiEye, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerOrders = () => {
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); // Pending, Confirmed, Shipped, Delivered, Cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getOrders();
      if (res.success) {
        // Map backend orders structure if needed
        setSellerOrders(res.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await sellerService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order #${orderId} marked as ${newStatus}`);
        setSellerOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Filter orders by active status tab
  const filteredOrders = useMemo(() => {
    return sellerOrders.filter(o => o.status === activeTab);
  }, [sellerOrders, activeTab]);

  const handlePrintLabel = (orderId) => {
    toast.success(`Shipping label queued for printer (Order #${orderId})`);
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'Pending':
        return { label: 'Approve Order', next: 'Approved' };
      case 'Approved':
        return { label: 'Accept & Pack', next: 'Processing' };
      case 'Processing':
        return { label: 'Ship Package', next: 'Shipped' };
      case 'Shipped':
        return { label: 'Mark Delivered', next: 'Delivered' };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-[#ff6a00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 truncate">Merchant Shipments</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Accept, packaging, printing labels, and fulfill customer requests.</p>
        </div>
      </div>

      {/* Status Navigation Tabs */}
      <div className="flex border-b border-gray-100 gap-4 sm:gap-6 overflow-x-auto hide-scrollbar whitespace-normal sm:whitespace-nowrap w-full">
        {['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => {
          const count = sellerOrders.filter(o => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[11px] sm:text-xs font-bold transition-all relative border-b-2 shrink-0 ${
                activeTab === tab
                  ? 'border-[#ff6a00] text-[#ff6a00]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>{tab}</span>
              {count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-w-0 w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 whitespace-normal sm:whitespace-nowrap">Order Details</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Customer</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Items Count</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Total Price</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 text-center whitespace-normal sm:whitespace-nowrap">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
              {filteredOrders.map((order) => {
                const action = getNextAction(order.status);
                return (
                  <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                    {/* Order ID & Date */}
                    <td className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 whitespace-normal sm:whitespace-nowrap">
                      <p className="font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">{order._id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 whitespace-normal sm:whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-1 sm:px-4 py-2 sm:py-4">
                      <p className="font-bold text-gray-800 whitespace-normal sm:whitespace-nowrap">{order.user?.name || 'Guest User'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 whitespace-normal sm:whitespace-nowrap">{order.user?.email || 'N/A'}</p>
                    </td>

                    {/* Items count */}
                    <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 font-semibold whitespace-normal sm:whitespace-nowrap">
                      {order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0} Items
                    </td>

                    {/* Total Price */}
                    <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">
                      Rs. {(order.sellerTotal || 0).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-1 sm:px-4 py-2 sm:py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2 flex-wrap min-w-0">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors border border-gray-100 shrink-0"
                          title="View order details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        
                        {action && (
                          <button
                            onClick={() => updateOrderStatus(order._id, action.next)}
                            className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm shrink-0"
                          >
                            {action.label}
                          </button>
                        )}

                        {order.status === 'Processing' && (
                          <button
                            onClick={() => handlePrintLabel(order._id)}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors border border-gray-100 shrink-0"
                            title="Print label"
                          >
                            <FiPrinter className="h-4 w-4" />
                          </button>
                        )}

                        {order.status === 'Pending' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors shrink-0"
                            title="Reject Order"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No orders found in "{activeTab}" status list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative min-w-0 overflow-hidden">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 pr-6 truncate">Order Details ({selectedOrder._id})</h3>
            
            <div className="space-y-4 text-xs text-gray-700 min-w-0">
              <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl space-y-1.5 min-w-0">
                <p className="truncate"><strong>Customer:</strong> {selectedOrder.user?.name || 'Guest User'}</p>
                <p className="truncate"><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
              </div>

              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 mb-2">Order Products</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white max-h-48 overflow-y-auto w-full">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center gap-2">
                      <span className="font-bold truncate flex-1 min-w-0">{item.name} (x{item.quantity})</span>
                      <span className="text-[#ff6a00] font-bold shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-gray-900 border-t border-gray-100 pt-3 flex-wrap gap-2">
                <span>Subtotal (Your items)</span>
                <span className="text-[#ff6a00]">Rs. {(selectedOrder.sellerTotal || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
