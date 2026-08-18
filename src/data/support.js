export const mockTickets = [
  {
    id: "TCK-1001",
    subject: "Where is my refund for Order ORD-89100?",
    category: "Refund",
    status: "Open",
    createdAt: "2026-07-13T10:00:00Z",
    updatedAt: "2026-07-13T14:30:00Z",
    messages: [
      {
        id: "msg-1",
        senderRole: "Customer",
        senderName: "Fahad Mazari",
        text: "Hi, I returned the damaged shoes on Monday. When can I expect my refund in my bank account?",
        timestamp: "2026-07-13T10:00:00Z",
        status: "Seen"
      },
      {
        id: "msg-2",
        senderRole: "Agent",
        senderName: "Support Team",
        text: "Hello Fahad! We have received your return at our warehouse. The quality check is complete and your refund of Rs. 4,500 has been initiated. It should reflect in your bank account within 3-5 business days.",
        timestamp: "2026-07-13T14:30:00Z",
        status: "Sent"
      }
    ]
  }
];
