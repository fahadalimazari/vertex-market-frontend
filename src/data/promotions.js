export const promotions = [
  {
    id: 'promo-1',
    title: 'Summer Mega Clearance',
    description: 'Up to 70% off on all summer essentials including clothing, accessories, and outdoor gear.',
    type: 'marketplace', // marketplace, seller, brand
    bannerImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80',
    validFrom: '2026-06-01T00:00:00Z',
    validTo: '2026-08-31T23:59:59Z',
    isActive: true,
    featuredProducts: ['prod-3', 'prod-7'], // slugs or IDs
    badgeText: 'Summer Sale',
  },
  {
    id: 'promo-2',
    title: 'Tech Week 2026',
    description: 'Exclusive discounts on the latest laptops, smartphones, and accessories.',
    type: 'category',
    applicableCategories: ['electronics', 'computers'],
    bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
    validFrom: '2026-07-10T00:00:00Z',
    validTo: '2026-07-20T23:59:59Z',
    isActive: true,
    featuredProducts: ['prod-1', 'prod-2'],
    badgeText: 'Tech Week',
  }
];

export const bundleOffers = [
  {
    id: 'bundle-1',
    title: 'Ultimate Work From Home Kit',
    description: 'Buy a laptop, wireless mouse, and mechanical keyboard together and save 15% on the entire bundle.',
    items: ['prod-1', 'prod-2', 'prod-8'], // Product slugs
    discountType: 'percentage', // percentage, fixed
    discountValue: 15,
    isActive: true,
  },
  {
    id: 'bundle-2',
    title: 'Gaming Starter Pack',
    description: 'Get the latest console plus 2 top-tier games and save $50.',
    items: ['prod-9', 'prod-10', 'prod-11'],
    discountType: 'fixed',
    discountValue: 50,
    isActive: true,
  }
];

export const freeShippingCampaigns = [
  {
    id: 'fs-1',
    title: 'Free Shipping on Electronics',
    description: 'Enjoy free delivery on all electronic items over $500.',
    minimumOrder: 500,
    applicableCategories: ['electronics', 'computers'],
    validFrom: '2026-01-01T00:00:00Z',
    validTo: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'fs-2',
    title: 'Vertex Prime Free Delivery',
    description: 'Free shipping on all marketplace orders over $50.',
    minimumOrder: 50,
    applicableSellers: ['marketplace'],
    validFrom: '2026-01-01T00:00:00Z',
    validTo: '2026-12-31T23:59:59Z',
    isActive: true,
  }
];

export const referralRewards = {
  activeCampaign: {
    id: 'ref-1',
    title: 'Invite Friends, Earn Cash',
    description: 'Invite your friends to Vertex Market. They get a $10 welcome coupon, and you get $10 in Vertex Wallet when they make their first purchase.',
    referrerRewardType: 'wallet', // wallet, coupon, coins
    referrerRewardValue: 10,
    refereeRewardType: 'coupon',
    refereeRewardValue: 10,
    minimumPurchaseRequired: 50,
    isActive: true,
  }
};
