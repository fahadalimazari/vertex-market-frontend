export const faqCategories = [
  { id: "orders", name: "Orders & Delivery", icon: "FiPackage" },
  { id: "returns", name: "Returns & Refunds", icon: "FiRotateCcw" },
  { id: "payments", name: "Payments & Promos", icon: "FiCreditCard" },
  { id: "account", name: "Account & Security", icon: "FiUser" }
];

export const faqArticles = [
  {
    id: "faq-1",
    categoryId: "orders",
    question: "How can I track my order?",
    answer: "You can track your order in real-time by going to the 'Track Order' page and entering your Order ID. Alternatively, you can view the tracking timeline directly from your 'My Orders' dashboard."
  },
  {
    id: "faq-2",
    categoryId: "returns",
    question: "What is your return policy?",
    answer: "We offer a 14-day hassle-free return policy. If you receive a damaged, defective, or incorrect item, you can initiate a return request from your order details page. Please ensure the item is unused and in its original packaging."
  },
  {
    id: "faq-3",
    categoryId: "refunds",
    question: "How long does a refund take?",
    answer: "Once your return is received and inspected at our warehouse, your refund will be processed. Wallet refunds are instant. Bank and Card refunds typically take 3-5 business days to reflect in your account."
  },
  {
    id: "faq-4",
    categoryId: "payments",
    question: "Can I use multiple coupons on one order?",
    answer: "No, currently our system only allows one coupon or promo code to be applied per order. However, you can use a coupon along with existing flash sale discounts!"
  },
  {
    id: "faq-5",
    categoryId: "account",
    question: "How do I change my shipping address?",
    answer: "You can manage your addresses from your Dashboard under 'Address Book'. You can add, edit, or delete addresses. Note that you cannot change the shipping address of an order once it has been packed."
  }
];
