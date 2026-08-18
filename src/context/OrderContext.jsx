import { createContext, useState, useEffect, useCallback } from 'react';
import { fetchOrders, fetchReturns, fetchRefunds } from '../services/orderService';
import { fetchTracking } from '../services/trackingService';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [refunds, setRefunds] = useState([]);
  
  const [activeTracking, setActiveTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [oData, rData, refData] = await Promise.all([
          fetchOrders(), fetchReturns(), fetchRefunds()
        ]);
        setOrders(oData);
        setReturns(rData);
        setRefunds(refData);
      } catch (error) {
        console.error("Error loading order data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync to localStorage (Only for returns and refunds, orders are from backend)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('vertex_returns_v1', JSON.stringify(returns));
      localStorage.setItem('vertex_refunds_v1', JSON.stringify(refunds));
    }
  }, [returns, refunds, isLoading]);

  const getOrderById = useCallback((id) => {
    return orders.find(o => o.id === id || o._id === id);
  }, [orders]);

  const trackOrder = useCallback(async (orderId) => {
    setIsLoading(true);
    const timeline = await fetchTracking(orderId);
    setActiveTracking(timeline);
    setIsLoading(false);
    return timeline;
  }, []);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      const data = localStorage.getItem('vertex_auth_v1') || sessionStorage.getItem('vertex_auth_v1');
      if (!data) return false;
      const { token } = JSON.parse(data);

      const res = await fetch(`http://localhost:5000/api/v1/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (!result.success) {
        toast.error(result.message || "Failed to cancel order.");
        return false;
      }

      setOrders(prev => prev.map(o => o.id === orderId || o._id === orderId ? { ...o, status: 'Cancelled' } : o));
      
      const order = orders.find(o => o.id === orderId || o._id === orderId);
      // Auto initiate refund if paid
      if (order && order.isPaid) {
        const newRefund = {
          id: `REF-${Date.now()}`,
          orderId,
          amount: order.totalPrice,
          status: 'Refund Processing',
          method: order.paymentMethod,
          requestDate: new Date().toISOString()
        };
        setRefunds(prev => [newRefund, ...prev]);
        addNotification("Refund Initiated", `Your refund of Rs. ${order.totalPrice.toLocaleString()} is processing.`, "financial");
      }

      addNotification("Order Cancelled", `Order ${orderId} has been cancelled successfully.`, "orders");
      toast.success("Order cancelled successfully.");
      return true;
    } catch (error) {
      console.error('Failed to cancel order', error);
      toast.error('An error occurred.');
      return false;
    }
  }, [orders, addNotification]);

  const requestReturn = useCallback(async (orderId, productId, reason, notes) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    if (order.status !== 'Delivered') {
      toast.error("You can only return delivered items.");
      return false;
    }

    const newReturn = {
      id: `RET-${Date.now()}`,
      orderId,
      productId,
      reason,
      notes,
      status: 'Return Requested',
      requestDate: new Date().toISOString()
    };

    setReturns(prev => [newReturn, ...prev]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Return Requested' } : o));
    
    addNotification("Return Requested", `Your return request for order ${orderId} is under review.`, "orders");
    toast.success("Return request submitted successfully.");
    return true;
  }, [orders, addNotification]);

  const getOrderStats = useCallback(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
      completed: orders.filter(o => o.status === 'Delivered').length
    };
  }, [orders]);

  const value = {
    orders,
    returns,
    refunds,
    activeTracking,
    isLoading,
    getOrderById,
    trackOrder,
    cancelOrder,
    requestReturn,
    getOrderStats
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
