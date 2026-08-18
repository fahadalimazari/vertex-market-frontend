export const mockTracking = [
  {
    orderId: "ORD-89231",
    timeline: [
      { status: "Order Placed", details: "Order received and confirmed", timestamp: "2026-07-12T10:30:00Z", location: "Online" },
      { status: "Packed", details: "Order packed by seller", timestamp: "2026-07-12T14:45:00Z", location: "Vertex Warehouse, Karachi" },
      { status: "Shipped", details: "Handed over to courier partner", timestamp: "2026-07-13T09:10:00Z", location: "TCS Hub, Karachi" },
      { status: "Out For Delivery", details: "Rider is out for delivery", timestamp: "2026-07-14T08:30:00Z", location: "Clifton, Karachi" },
      { status: "Delivered", details: "Package handed to customer", timestamp: "2026-07-14T11:05:00Z", location: "123 Tech Park" }
    ]
  },
  {
    orderId: "ORD-89232",
    timeline: [
      { status: "Order Placed", details: "Order received and confirmed", timestamp: "2026-07-14T09:15:00Z", location: "Online" },
      { status: "Packed", details: "Order packed by seller", timestamp: "2026-07-14T10:00:00Z", location: "Gadget Hub Store" },
      { status: "Shipped", details: "In transit to destination facility", timestamp: "2026-07-14T11:15:00Z", location: "Leopard Hub, Karachi" }
    ]
  }
];
