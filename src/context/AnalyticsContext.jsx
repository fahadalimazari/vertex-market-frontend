import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

const AnalyticsContext = createContext(null);
const ANALYTICS_KEY = 'vertex_analytics_v1';
const SELLER_ORDERS_KEY = 'vertex_seller_orders_v1';

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { generateNotification } = useNotifications();

  // Load Balance & Transaction logs
  const [earnings, setEarnings] = useState(() => {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      const defaultState = {
        available: 184500,
        pending: 34500,
        total: 284000,
        withdrawn: 65000,
        transactions: [
          { id: 'TXN-90231', type: 'order_sale', amount: 15400, date: '2026-07-09T14:30:00Z', status: 'completed', description: 'Sale earnings for #ORD-892341' },
          { id: 'TXN-90209', type: 'withdrawal', amount: 35000, date: '2026-07-05T09:15:00Z', status: 'completed', description: 'Payout transfer to Habib Bank' },
          { id: 'TXN-90184', type: 'order_sale', amount: 23100, date: '2026-07-03T11:20:00Z', status: 'completed', description: 'Sale earnings for #ORD-892342' }
        ]
      };
      return data ? JSON.parse(data) : defaultState;
    } catch (e) {
      console.error('Failed to load earnings', e);
      return {};
    }
  });

  // Load Seller Incoming Orders
  const [sellerOrders, setSellerOrders] = useState(() => {
    try {
      const data = localStorage.getItem(SELLER_ORDERS_KEY);
      const defaultOrders = [
        { id: 'ORD-984381', date: '2026-07-10T12:30:00Z', customer: { fullName: 'Ali Ahmed', email: 'ali@gmail.com', phone: '03001122334' }, items: [{ name: 'Apple MacBook Air M4', price: 295000, quantity: 1 }], total: 295000, status: 'Pending' },
        { id: 'ORD-984352', date: '2026-07-08T15:20:00Z', customer: { fullName: 'Saira Bano', email: 'saira@outlook.com', phone: '03129876543' }, items: [{ name: 'Sony WH-1000XM5', price: 95000, quantity: 1 }], total: 95000, status: 'Delivered' }
      ];
      return data ? JSON.parse(data) : defaultOrders;
    } catch (e) {
      console.error('Failed to load seller orders', e);
      return [];
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem(SELLER_ORDERS_KEY, JSON.stringify(sellerOrders));
  }, [sellerOrders]);

  // Request Withdrawal Action
  const requestWithdrawal = useCallback((amount, bankDetails) => {
    const numAmt = Number(amount);
    if (numAmt <= 0) {
      toast.error('Withdrawal amount must be greater than zero');
      return false;
    }
    if (numAmt > earnings.available) {
      toast.error('Insufficient available balance');
      return false;
    }

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'withdrawal',
      amount: numAmt,
      date: new Date().toISOString(),
      status: 'pending',
      description: `Withdrawal transfer to ${bankDetails.bankName} (${bankDetails.accountNumber.substr(-4)})`
    };

    setEarnings(prev => ({
      ...prev,
      available: prev.available - numAmt,
      withdrawn: prev.withdrawn + numAmt,
      transactions: [newTxn, ...prev.transactions]
    }));

    toast.success('Withdrawal request submitted successfully!');

    generateNotification(
      "Withdrawal Request Received",
      `Your request to withdraw Rs. ${numAmt.toLocaleString()} has been queued for verification.`,
      "payments",
      "medium",
      "/seller/earnings"
    );

    // Auto complete withdrawal after 6 seconds for demo
    setTimeout(() => {
      setEarnings(prev => ({
        ...prev,
        transactions: prev.transactions.map(t => 
          t.id === newTxn.id ? { ...t, status: 'completed' } : t
        )
      }));
      generateNotification(
        "Withdrawal Processed",
        `Rs. ${numAmt.toLocaleString()} has been credited to your bank account. Transfer ID: ${newTxn.id}.`,
        "payments",
        "high",
        "/seller/earnings"
      );
    }, 6000);

    return true;
  }, [earnings, generateNotification]);

  // Order status progression
  const updateOrderStatus = useCallback((orderId, nextStatus) => {
    setSellerOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        toast.success(`Order #${orderId} marked as ${nextStatus}`);
        
        generateNotification(
          `Order Status: ${nextStatus}`,
          `Your order #${orderId} has been successfully updated to state: ${nextStatus}.`,
          "orders",
          nextStatus === 'Delivered' ? 'high' : 'medium',
          `/seller/orders`
        );

        // Adjust earnings balance on successful delivery completion
        if (nextStatus === 'Delivered') {
          const saleEarnings = order.total * 0.95; // 5% marketplace commission
          const newTxn = {
            id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
            type: 'order_sale',
            amount: saleEarnings,
            date: new Date().toISOString(),
            status: 'completed',
            description: `Sale earnings for #${orderId} (after commission)`
          };
          
          setEarnings(prev => ({
            ...prev,
            available: prev.available + saleEarnings,
            total: prev.total + saleEarnings,
            transactions: [newTxn, ...prev.transactions]
          }));
        }

        return { ...order, status: nextStatus };
      }
      return order;
    }));
  }, [generateNotification]);

  return (
    <AnalyticsContext.Provider value={{
      earnings,
      sellerOrders,
      requestWithdrawal,
      updateOrderStatus
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
