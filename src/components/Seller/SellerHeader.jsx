import { useStore } from '../../context/StoreContext';
import { useSeller } from '../../context/SellerContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiShoppingBag, FiCheckCircle, FiMenu, FiMoon, FiSun } from 'react-icons/fi';

const SellerHeader = ({ toggleSidebar }) => {
  const { storeSettings } = useStore();
  const { sellerProfile } = useSeller();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const displayStoreName = sellerProfile?.storeName || sellerProfile?.businessName || sellerProfile?.name || user?.name || storeSettings.name;
  const displayLogo = sellerProfile?.storeLogo || sellerProfile?.logo || user?.avatar || storeSettings.logo;

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        
        
        <div className="h-9 w-9 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden flex items-center justify-center p-1 shrink-0">
          <img
            src={displayLogo}
            alt={displayStoreName}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate">
            {displayStoreName}
          </h2>
          <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-wider truncate">
            <FiCheckCircle className="h-3 w-3 shrink-0" /> <span className="truncate hidden sm:inline">Verified Merchant</span><span className="truncate sm:hidden">Verified</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 pl-2">
        <button 
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          title="Toggle Theme"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 sm:px-3 py-1.5 rounded-lg hidden sm:block">
          Business: {sellerProfile?.entityType || 'Individual'}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 sm:px-3 py-1.5 rounded-lg block sm:hidden">
          {sellerProfile?.entityType || 'Indiv.'}
        </span>
      </div>
    </header>
  );
};

export default SellerHeader;
