import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const OrderManagementContext = createContext(null);
const ORDERS_KEY = 'vertex_admin_orders_v1';

export const useOrderManagement = () => {
  const context = useContext(OrderManagementContext);
  if (!context) {
    throw new Error('useOrderManagement must be used within a OrderManagementProvider');
  }
  return context;
};

export const OrderManagementProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      const defaultOrders = [
        { id: 'ORD-892341', date: '2026-07-09T14:30:00Z', customer: 'Ali Ahmed', total: 295000, status: 'Delivered', sellerStore: 'Vertex Electro Store' },
        { id: 'ORD-892342', date: '2026-07-03T11:20:00Z', customer: 'Saira Bano', total: 95000, status: 'Pending', sellerStore: 'Vertex Electro Store' },
        { id: 'ORD-892343', date: '2026-07-10T12:00:00Z', customer: 'Zara Sheikh', total: 18000, status: 'Confirmed', sellerStore: 'Fashion Hub' }
      ];
      return data ? JSON.parse(data) : defaultOrders;
    } catch (e) {
      console.error('Failed to load admin orders', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const updateOrderStatus = useCallback((id, nextStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: nextStatus } : o
    ));
    toast.success(`Order #${id} marked as ${nextStatus}`);
  }, []);

  const refundOrder = useCallback((id) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'Refunded' } : o
    ));
    toast.success(`Refund processed successfully for Order #${id}`);
  }, []);

  const printInvoice = useCallback((id) => {
    toast.success(`Queued invoice PDF for Order #${id}`);
  }, []);

  return (
    <OrderManagementContext.Provider value={{
      orders,
      updateOrderStatus,
      refundOrder,
      printInvoice
    }}>
      {children}
    </OrderManagementContext.Provider>
  );
};
