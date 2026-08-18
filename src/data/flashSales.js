export const flashSales = [
  {
    id: 'fsale-1',
    title: 'Midnight Tech Deals',
    description: 'Insane discounts on tech gadgets. Ends in 2 hours!',
    bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
    startTime: new Date(Date.now() - 3600000).toISOString(), // Started 1 hour ago
    endTime: new Date(Date.now() + 7200000).toISOString(), // Ends in 2 hours
    status: 'active', // active, upcoming, expired
    products: [
      {
        productId: 'prod-1', // MacBook Pro
        flashPrice: 1099.99,
        originalPrice: 1299.99,
        discountPercentage: 15,
        totalStock: 50,
        soldStock: 45, // 90% sold
      },
      {
        productId: 'prod-2', // iPhone 14
        flashPrice: 799.99,
        originalPrice: 999.99,
        discountPercentage: 20,
        totalStock: 100,
        soldStock: 30, // 30% sold
      },
      {
        productId: 'prod-9', // Sony Headphones
        flashPrice: 199.99,
        originalPrice: 349.99,
        discountPercentage: 42,
        totalStock: 200,
        soldStock: 195, // 97.5% sold
      }
    ]
  },
  {
    id: 'fsale-2',
    title: 'Weekend Fashion Blowout',
    description: 'Get ready for the weekend with our top fashion picks.',
    bannerImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    startTime: new Date(Date.now() + 86400000).toISOString(), // Starts in 1 day
    endTime: new Date(Date.now() + 172800000).toISOString(), // Ends in 2 days
    status: 'upcoming',
    products: [
      {
        productId: 'prod-3', // Nike Air Max
        flashPrice: 89.99,
        originalPrice: 129.99,
        discountPercentage: 30,
        totalStock: 300,
        soldStock: 0,
      }
    ]
  }
];
