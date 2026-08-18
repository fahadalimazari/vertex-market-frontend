export const aiResponses = {
  // Generic greeting
  greeting: {
    text: "Hi there! 👋 I'm your AI Shopping Assistant. How can I help you discover the perfect products today?",
    suggestions: [
      "Best Laptop Under 150k",
      "Gaming Accessories",
      "Mobile Phones",
      "Today's Deals",
      "Available Coupons",
      "Where Is My Package?",
      "Return Product",
      "Open Support Ticket",
      "Change Language",
      "Convert Price",
      "Translate This Product"
    ]
  },
  
  // Specific query matching logic (Dummy)
  queries: [
    {
      keywords: ["laptop", "150k", "best laptop", "under 150k", "100k", "gaming laptop", "hp"],
      response: {
        text: "I found some excellent laptops that fit your criteria. These offer great performance and value for money.",
        type: "recommendation",
        products: [
          {
            id: 6, // Refers to product ID from products.js (HP 15s)
            aiReason: "Perfect balance of performance and battery life for everyday productivity. Core i5 delivers smooth multitasking."
          },
          {
            id: 8, // Refers to product ID (Lenovo Legion)
            aiReason: "Top tier gaming performance. While slightly above typical budgets, it's the absolute best value right now."
          }
        ],
        suggestions: ["Show me more laptops", "Compare these two", "Gaming accessories"]
      }
    },
    {
      keywords: ["phone", "mobile", "samsung", "s23", "best phone", "50k"],
      response: {
        text: "Here are the best mobile phones currently available based on your search.",
        type: "recommendation",
        products: [
          {
            id: 2, // Samsung Galaxy S23 Ultra
            aiReason: "The ultimate flagship experience. Unmatched camera capabilities and S-Pen productivity."
          }
        ],
        suggestions: ["Compare with iPhone", "Phone cases for S23", "Show budget phones"]
      }
    },
    {
      keywords: ["compare", "vs", "difference", "iphone vs samsung", "samsung vs iphone"],
      response: {
        text: "Here is a detailed comparison between the top flagship devices you asked about.",
        type: "comparison",
        comparisonData: {
          highlight: "Best Overall Value",
          items: [
            {
              id: "item1",
              name: "Samsung Galaxy S23 Ultra",
              image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2070&auto=format&fit=crop",
              price: "Rs. 289,999",
              brand: "Samsung",
              rating: "4.9",
              specs: {
                display: "6.8\" Dynamic AMOLED 2X",
                camera: "200MP Main + 12MP Ultra + 10MP Tele",
                battery: "5000 mAh (45W Fast Charging)",
                processor: "Snapdragon 8 Gen 2 for Galaxy",
                storage: "256GB / 512GB / 1TB"
              },
              verdict: "Premium Pick"
            },
            {
              id: "item2",
              name: "iPhone 15 Pro Max",
              image: "https://images.unsplash.com/photo-1609599006353-e629eeabfeae?q=80&w=2070&auto=format&fit=crop",
              price: "Rs. 419,999",
              brand: "Apple",
              rating: "4.8",
              specs: {
                display: "6.7\" Super Retina XDR OLED",
                camera: "48MP Main + 12MP Ultra + 12MP Tele",
                battery: "4422 mAh (20W Fast Charging)",
                processor: "A17 Pro (3nm)",
                storage: "256GB / 512GB / 1TB"
              },
              verdict: "Better Video & Ecosystem"
            }
          ]
        },
        suggestions: ["Buy Samsung S23 Ultra", "Show more comparisons", "Clear chat"]
      }
    },
    {
      keywords: ["worth buying", "pros and cons", "pros & cons", "good"],
      response: {
        text: "Based on customer reviews and expert analysis, this is an excellent choice. It has a 4.8/5 average rating from over 1,200 buyers.",
        type: "text",
        suggestions: ["Best Alternatives", "Show specifications", "Compare Similar Products"]
      }
    },
    {
      keywords: ["coupon", "discount", "promo", "voucher", "deal", "offer", "sale", "flash sale"],
      response: {
        text: "We have some amazing promotions running right now! Here are the best ways to save on your order.",
        type: "text",
        suggestions: ["Show me Flash Sales", "What are Bundle Offers?", "View Voucher Wallet", "Go to Coupon Center"]
      }
    },
    {
      keywords: ["track", "package", "where is", "delivery", "shipping", "order status", "status"],
      response: {
        text: "I can help you track your order! The easiest way is to enter your Order ID on our tracking page. Let me redirect you there.",
        type: "text",
        suggestions: ["Open Help Center", "Contact Support", "Show my latest order"]
      }
    },
    {
      keywords: ["return", "refund", "cancel", "exchange", "damaged", "wrong item", "money back"],
      response: {
        text: "I'm sorry to hear you need to return an item. You can initiate a return or cancel an order directly from your Orders page.",
        type: "text",
        suggestions: ["Refund Status", "Return Policy", "Open Support Ticket"]
      }
    },
    {
      keywords: ["support", "ticket", "help", "agent", "human", "contact", "chat"],
      response: {
        text: "Our dedicated support team is available 24/7. You can easily create a new support ticket and an agent will assist you shortly.",
        type: "text",
        suggestions: ["Open Support Ticket", "Help Center", "Delivery Estimate"]
      }
    },
    {
      keywords: ["translate", "language", "arabic", "urdu", "english", "spanish"],
      response: {
        text: "I can help you translate the interface! You can change the language using the globe icon in the top bar or let me know which language you prefer.",
        type: "text",
        suggestions: ["Change Language to Urdu", "Change Language to Arabic", "Go to Settings"]
      }
    },
    {
      keywords: ["currency", "convert", "price in", "usd", "pkr", "aed", "sar"],
      response: {
        text: "I can convert prices for you! You can also set a default currency in your localization settings.",
        type: "text",
        suggestions: ["Change Currency to USD", "Change Currency to AED", "Show Regional Offers"]
      }
    },
    {
      keywords: ["region", "country", "delivery to", "shipping to", "local"],
      response: {
        text: "We offer regional pricing, targeted shipping rates, and localized deals. Please select your country to see customized options.",
        type: "text",
        suggestions: ["Products In My Country", "Regional Payment Methods", "Estimated Delivery"]
      }
    }
  ],
  
  // Default fallback if AI doesn't understand
  fallback: {
    text: "I couldn't quite find what you're looking for. Could you try rephrasing your question or selecting one of the popular options below?",
    suggestions: [
      "Show all electronics",
      "Today's Flash Sales",
      "Trending Products",
      "Contact Support"
    ]
  }
}
