import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiPackage, FiShoppingCart, FiCreditCard, 
  FiSettings, FiTag, FiUsers, FiRotateCcw, FiPieChart,
  FiBox, FiMonitor, FiShield, FiSearch, FiLifeBuoy, FiMessageSquare,
  FiChevronDown
} from 'react-icons/fi';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { path: '/seller/dashboard', title: 'Dashboard', icon: FiGrid },
      { path: '/seller/analytics', title: 'Analytics & Revenue', icon: FiPieChart },
    ]
  },
  {
    title: 'Operations',
    items: [
      { path: '/seller/products', title: 'Products', icon: FiPackage },
      { path: '/seller/orders', title: 'Orders', icon: FiShoppingCart },
      { path: '/seller/returns', title: 'Returns Manager', icon: FiRotateCcw },
      { path: '/seller/finance', title: 'Finance & Payouts', icon: FiCreditCard },
    ]
  },
  {
    title: 'Management',
    items: [
      { path: '/seller/inventory', title: 'Warehouse & Inventory', icon: FiBox },
      { path: '/seller/staff', title: 'Staff Management', icon: FiUsers },
      { path: '/seller/coupons', title: 'Marketing & Coupons', icon: FiTag },
    ]
  },
  {
    title: 'Storefront',
    items: [
      { path: '/seller/theme', title: 'Theme & Banner', icon: FiMonitor },
      { path: '/seller/policies', title: 'Store Policies', icon: FiShield },
      { path: '/seller/seo', title: 'Store SEO', icon: FiSearch },
    ]
  },
  {
    title: 'Support',
    items: [
      { path: '/seller/messages', title: 'Messages', icon: FiMessageSquare },
      { path: '/seller/support', title: 'Support Center', icon: FiLifeBuoy },
      { path: '/seller/settings', title: 'Store Settings', icon: FiSettings }
    ]
  }
];

const SidebarItem = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-xs font-bold ${
        isActive 
          ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-600/20' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      <span>{item.title}</span>
    </NavLink>
  );
};

const SellerSidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen flex flex-col bg-gray-900 dark:bg-gray-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top Logo Accents */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 dark:border-gray-900 shrink-0">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white leading-none">
                VERTEX <span className="text-[#ff6a00]">SELLER</span>
              </span>
            </Link>
            <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-widest">
              Merchant Administration
            </p>
          </div>
          {/* Close button for mobile only */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation list links */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar py-6 px-3 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-4 mb-2">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{group.title}</span>
              </div>
              {group.items.map((item) => (
                <div key={item.path} onClick={() => setIsOpen(false)}>
                  <SidebarItem item={item} />
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer Return Home link */}
        <div className="border-t border-gray-800/60 p-4 mt-auto shrink-0">
          <Link 
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-gray-900/80 hover:bg-gray-800 p-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors border border-gray-800/80 shadow-inner"
          >
            <span>Exit Portal</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
