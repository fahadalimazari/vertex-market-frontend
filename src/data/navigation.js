import { FiHome, FiZap, FiPackage, FiStar, FiGrid, FiGift, FiTruck, FiHeadphones } from 'react-icons/fi';

export const MAIN_MENU_ITEMS = [
  { icon: FiHome, label: 'Home', href: '/' },
  { icon: FiZap, label: 'Flash Deals', href: '/products?filter=flash-sale' },
  { icon: FiPackage, label: 'New Arrivals', href: '/products?sort=newest' },
  { icon: FiStar, label: 'Best Sellers', href: '/products?sort=highestRated' },
  { icon: FiGrid, label: 'Top Brands', href: '/stores' },
  { icon: FiGrid, label: 'Categories', href: '/categories' },
  { icon: FiGift, label: "Today's Deals", href: '/products?filter=todays-deals' }
];

export const SUPPORT_MENU_ITEMS = [
  { icon: FiTruck, label: 'Track Order', href: '/track-order' },
  { icon: FiHeadphones, label: 'Customer Support', href: '/support' }
];

export const ALL_MOBILE_MENU_ITEMS = [...MAIN_MENU_ITEMS, ...SUPPORT_MENU_ITEMS];
