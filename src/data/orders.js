export const mockOrders = [
  {
    id: "ORD-89231",
    customerName: "Fahad Mazari",
    customerId: "user_1",
    date: "2026-07-12T10:30:00Z",
    status: "Delivered",
    paymentMethod: "Credit Card (ending 4242)",
    paymentStatus: "Paid",
    subtotal: 350000,
    discount: 0,
    tax: 15000,
    shippingFee: 0,
    total: 365000,
    items: [
      {
        productId: 1,
        name: "iPhone 15 Pro Max",
        quantity: 1,
        price: 350000,
        sellerId: "seller_1",
        sellerName: "Vertex Official",
        image: "https://images.unsplash.com/photo-1609599006353-e629eeabfeae?auto=format&fit=crop&q=80&w=400"
      }
    ],
    deliveryAddress: {
      fullName: "Fahad Mazari",
      street: "123 Tech Park",
      city: "Karachi",
      state: "Sindh",
      zip: "75000",
      phone: "+92 300 1234567"
    }
  },
  {
    id: "ORD-89232",
    customerName: "Fahad Mazari",
    customerId: "user_1",
    date: "2026-07-14T09:15:00Z",
    status: "Shipped",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    subtotal: 125000,
    discount: 5000,
    couponUsed: "WELCOME5K",
    tax: 5000,
    shippingFee: 500,
    total: 125500,
    items: [
      {
        productId: 2,
        name: "Samsung Galaxy Watch 6",
        quantity: 1,
        price: 125000,
        sellerId: "seller_2",
        sellerName: "Gadget Hub",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400"
      }
    ],
    deliveryAddress: {
      fullName: "Fahad Mazari",
      street: "123 Tech Park",
      city: "Karachi",
      state: "Sindh",
      zip: "75000",
      phone: "+92 300 1234567"
    }
  }
];
