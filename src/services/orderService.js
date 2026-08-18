export const fetchOrders = async () => {
  try {
    const data = localStorage.getItem('vertex_session_v1');
    if (!data) return [];
    
    const { token } = JSON.parse(data);
    
    const response = await fetch('http://localhost:5000/api/v1/orders/myorders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return [];

    const result = await response.json();
    if (result.success) {
      // Map MongoDB properties to frontend properties
      return result.data.map(order => ({ 
        ...order, 
        id: order._id,
        date: order.createdAt,
        total: order.totalPrice,
        items: order.orderItems,
        customerName: order.user?.name || 'Customer',
        deliveryAddress: {
          street: order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.country || '',
          zip: order.shippingAddress?.postalCode || '',
          phone: order.shippingAddress?.phone || ''
        },
        paymentStatus: order.isPaid ? 'Paid' : 'Pending',
        subtotal: order.itemsPrice || 0,
        tax: order.taxPrice || 0,
        shippingFee: order.shippingPrice || 0,
        discount: 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching orders from backend:', error);
    return [];
  }
};

export const fetchReturns = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('vertex_returns_v1');
      if (saved) {
        resolve(JSON.parse(saved));
      } else {
        import('../data/returns').then(module => {
          resolve(module.mockReturns);
        });
      }
    }, 500);
  });
};

export const fetchRefunds = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('vertex_refunds_v1');
      if (saved) {
        resolve(JSON.parse(saved));
      } else {
        import('../data/refunds').then(module => {
          resolve(module.mockRefunds);
        });
      }
    }, 500);
  });
};
