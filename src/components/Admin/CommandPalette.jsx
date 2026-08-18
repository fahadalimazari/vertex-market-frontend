import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiShoppingBag, FiUsers, FiBox, 
  FiTag, FiFileText, FiSettings, FiX
} from 'react-icons/fi';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const commands = [
    { title: 'Products', items: [
      { id: 'p1', name: 'Add New Product', icon: FiBox, path: '/admin/products' },
      { id: 'p2', name: 'Manage Inventory', icon: FiBox, path: '/admin/products' }
    ]},
    { title: 'Orders', items: [
      { id: 'o1', name: 'View All Orders', icon: FiShoppingBag, path: '/admin/orders' },
      { id: 'o2', name: 'Refund Requests', icon: FiShoppingBag, path: '/admin/orders' }
    ]},
    { title: 'Users & Sellers', items: [
      { id: 'u1', name: 'Approve Sellers', icon: FiUsers, path: '/admin/sellers' },
      { id: 'u2', name: 'Manage Customers', icon: FiUsers, path: '/admin/users' }
    ]},
    { title: 'CMS & Settings', items: [
      { id: 'c1', name: 'Homepage CMS', icon: FiFileText, path: '/admin/cms' },
      { id: 'c2', name: 'Marketplace Coupons', icon: FiTag, path: '/admin/coupons' },
      { id: 'c3', name: 'General Settings', icon: FiSettings, path: '/admin/settings' }
    ]}
  ];

  const filteredCommands = query === '' 
    ? commands 
    : commands.map(group => ({
        ...group,
        items: group.items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      })).filter(group => group.items.length > 0);

  const handleSelect = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:p-0 sm:pt-[10vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-gray-100 gap-3">
              <FiSearch className="text-gray-400 text-xl shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, or products..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-lg"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2 hide-scrollbar">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((group, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {group.title}
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-orange-600 text-gray-700 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-orange-100 group-hover:text-orange-600 flex items-center justify-center text-gray-500 transition-colors">
                          <item.icon size={16} />
                        </div>
                        <span className="font-semibold text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500 font-medium">
                  No results found for "{query}"
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>Navigate with keyboard</span>
              <div className="flex gap-2">
                <span className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">&uarr;&darr;</span>
                <span className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">Enter</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
