import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiUsers, FiShoppingBag, FiPackage, FiFolder, FiTag, 
  FiSettings, FiFileText, FiLogOut, FiPieChart, FiTruck, 
  FiShoppingCart, FiUserCheck, FiCpu, FiChevronDown, FiChevronLeft, FiChevronRight, FiMenu, FiSmartphone, FiSliders
} from 'react-icons/fi';
import { useRole } from '../../context/Admin/RoleContext';
import { useAdmin } from '../../context/Admin/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

const menuGroups = [
  {
    title: 'Core',
    items: [
      { path: '/admin/dashboard', title: 'Dashboard', icon: FiGrid, module: 'analytics' },
      { path: '/admin/analytics', title: 'Sales Analytics', icon: FiPieChart, module: 'analytics' },
      { path: '/admin/intelligence', title: 'AI Workspace', icon: FiCpu, module: 'intelligence', badge: 'New' },
    ]
  },
  {
    title: 'Commerce',
    items: [
      { 
        path: '/admin/products', 
        title: 'Products', 
        icon: FiPackage, 
        module: 'products',
        subItems: [
          { path: '/admin/products', title: 'Admin Products' },
          { path: '/admin/seller-products', title: 'Seller Products' }
        ]
      },
      { path: '/admin/orders', title: 'Orders', icon: FiShoppingCart, module: 'orders', badge: '12' },
      { path: '/admin/deliveries', title: 'Deliveries', icon: FiTruck, module: 'deliveries' },
      { 
        path: '/admin/cms', 
        title: 'CMS & Storefront', 
        icon: FiFolder, 
        module: 'cms',
        subItems: [
          { path: '/admin/hero-banners', title: 'Hero Banners' },
          { path: '/admin/cms', title: 'Homepage Manager' },
          { path: '/admin/collections', title: 'Collections' },
          { path: '/admin/categories', title: 'Categories' },
          { path: '/admin/featured-categories', title: 'Featured Categories' },
          { path: '/admin/subcategories', title: 'Sub Categories' },
          { path: '/admin/attributes', title: 'Attributes' },
          { path: '/admin/attribute-values', title: 'Attribute Values' },
          { path: '/admin/coupons', title: 'Coupons & Deals' }
        ]
      },
    ]
  },
  {
    title: 'Content Management',
    items: [
      { path: '/admin/hero-banners', title: 'Hero Banners', icon: FiFolder, module: 'cms', badge: 'Dynamic' },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { path: '/admin/hero-flash-sale', title: 'Hero Flash Sale', icon: FiTag, module: 'cms', badge: 'Live Deal' },
    ]
  },
  {
    title: 'Users & CRM',
    items: [
      { path: '/admin/customers', title: 'Customers', icon: FiUsers, module: 'customers' },
      { 
        path: '/admin/sellers', 
        title: 'Marketplace Sellers', 
        icon: FiUserCheck, 
        module: 'sellers',
        subItems: [
          { path: '/admin/sellers', title: 'All Sellers' },
          { path: '/admin/sellers/create', title: 'Add Seller' }
        ]
      },
      { path: '/admin/crm', title: 'CRM Pipeline', icon: FiUsers, module: 'crm' },
    ]
  },
  {
    title: 'System',
    items: [
      { path: '/admin/settings-hub', title: 'Enterprise Top Header & Settings', icon: FiSliders, module: 'settings', badge: 'New' },
      { path: '/admin/settings', title: 'Settings', icon: FiSettings, module: 'settings' },
      { path: '/admin/app-settings', title: 'Mobile App Settings', icon: FiSmartphone, module: 'settings', badge: 'Top Bar' },
      { path: '/admin/logs', title: 'Activity Logs', icon: FiFileText, module: 'logs' }
    ]
  }
];

const SidebarItem = ({ item, isCollapsed, onCloseMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path));

  const Icon = item.icon;

  if (item.subItems && !isCollapsed) {
    return (
      <div className="space-y-1">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-xs font-bold ${
            isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-orange-500' : ''}`} />
            <span>{item.title}</span>
          </div>
          <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-11 pr-2 space-y-1"
            >
              {item.subItems.map((sub, idx) => (
                <NavLink
                  key={idx}
                  to={sub.path}
                  className={({ isActive }) => `block px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                    isActive ? 'text-orange-500 bg-gray-800/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                  }`}
                  onClick={() => onCloseMobile && onCloseMobile()}
                >
                  {sub.title}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      title={isCollapsed ? item.title : ''}
      onClick={() => onCloseMobile && onCloseMobile()}
      className={({ isActive }) => `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-xs font-bold group ${
        isActive 
          ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/20' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
        {!isCollapsed && <span>{item.title}</span>}
      </div>
      {!isCollapsed && item.badge && (
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-orange-600' : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'}`}>
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};

const AdminSidebar = ({ onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentRole, changeRole, hasPermission } = useRole();
  const { adminLogout } = useAdmin();

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="bg-gradient-to-b from-gray-950 to-gray-900 dark:from-black dark:to-gray-950 border-r border-gray-800 dark:border-gray-800 text-white h-screen flex flex-col flex-shrink-0 sticky top-0 z-40 transition-all duration-300"
    >
      {/* Brand Header */}
      <div className="h-[72px] flex items-center justify-between px-5 border-b border-gray-800/60 dark:border-gray-800 shrink-0">
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
            <h2 className="text-xl font-black tracking-wider text-white leading-none">
              VERTEX <span className="text-orange-500">SUPER ADMIN</span>
            </h2>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center text-orange-500">
            <FiGrid size={24} />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-white transition-colors absolute -right-3 top-6 bg-gray-800 rounded-full p-1 border border-gray-700 shadow-md z-50 hidden md:block"
        >
          {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
        {/* Mobile Close Button */}
        <button 
          onClick={onCloseMobile}
          className="md:hidden text-gray-500 hover:text-white"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar py-6 px-3 space-y-6">
        {menuGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => hasPermission(item.module));
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{group.title}</span>
                </div>
              )}
              {visibleItems.map((item, idx) => (
                <SidebarItem key={idx} item={item} isCollapsed={isCollapsed} onCloseMobile={onCloseMobile} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer Settings & Logout */}
      <div className="border-t border-gray-800/60 p-4 mt-auto shrink-0">
        {!isCollapsed && (
          <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800/80 mb-3 shadow-inner">
            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
              <span>RBAC Sandbox</span>
              <span className="text-orange-500 px-1 rounded bg-orange-500/10">Dev Mode</span>
            </label>
            <select
              value={currentRole}
              onChange={(e) => changeRole(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-xs font-bold rounded-lg px-2.5 py-1.5 text-gray-300 outline-none focus:border-orange-500 transition-colors"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Support Agent">Support</option>
            </select>
          </div>
        )}

        <button 
          onClick={adminLogout}
          title={isCollapsed ? 'Logout' : ''}
          className={`flex items-center justify-center gap-2 w-full bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 p-2.5 rounded-xl text-xs font-bold transition-all border border-red-900/30 group ${isCollapsed ? 'px-0' : ''}`}
        >
          <FiLogOut className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span>Logout securely</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
