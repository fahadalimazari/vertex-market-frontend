import { useState, useRef, useEffect } from 'react';
import { FiHeart, FiShoppingCart, FiUser, FiLogOut, FiShoppingBag, FiSettings, FiGrid, FiRepeat, FiFolder, FiMoon, FiSun } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCompare } from '../../../context/CompareContext';
import { useCollections } from '../../../context/CollectionContext';
import MiniCart from './MiniCart';
import CompareBar from '../../Compare/CompareBar';
import NotificationBell from '../../Notifications/NotificationBell';
import { useTheme } from '../../../context/ThemeContext';

const NavIcons = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { compareItems } = useCompare();
  const { collections } = useCollections();
  
  const navigate = useNavigate();

  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const cartTimeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);

  const handleCartEnter = () => {
    if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    setShowMiniCart(true);
  };

  const handleCartLeave = () => {
    cartTimeoutRef.current = setTimeout(() => {
      setShowMiniCart(false);
    }, 200);
  };

  const handleUserEnter = () => {
    if (!isAuthenticated) return;
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    setShowUserDropdown(true);
  };

  const handleUserLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setShowUserDropdown(false);
    }, 250);
  };

  const handleLogoutClick = () => {
    setShowUserDropdown(false);
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Helper to fetch avatar from either backend or local dashboard state
  const getAvatar = () => {
    if (user?.role === 'Seller' && user?.sellerProfile?.storeLogo) {
      return user.sellerProfile.storeLogo;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    try {
      const localData = localStorage.getItem('vertex_user_v1');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.avatar) return parsed.avatar;
      }
    } catch (e) {}
    return null;
  };

  const currentAvatar = getAvatar();

  return (
    <div className="flex items-center gap-2 sm:gap-6 text-gray-700">
      
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
        title="Toggle Theme"
      >
        {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      {/* Account Icon / Dropdown Wrapper */}
      <div 
        className="relative flex items-center h-full py-4 -my-4"
        onMouseEnter={handleUserEnter}
        onMouseLeave={handleUserLeave}
      >
        {isAuthenticated ? (
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="h-9 w-9 rounded-full bg-[#ff6a00] text-white flex items-center justify-center font-bold text-sm border-2 border-orange-100 shadow-sm overflow-hidden">
              {currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt={user?.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-[11px] leading-tight text-gray-500 font-semibold uppercase tracking-wider">
                {user?.role || 'Customer'}
              </span>
              <span className="text-[14px] font-bold leading-tight text-gray-900 max-w-[100px] truncate">
                {user?.name?.split(' ')[0]}
              </span>
            </div>

            {/* Profile Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-white border border-gray-100 shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-50 mb-1.5">
                  <p className="text-xs font-semibold text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <Link 
                  to={user?.role === 'Seller' ? '/seller/dashboard' : (user?.role === 'Admin' || user?.role === 'Super Admin') ? '/admin/dashboard' : '/account'} 
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#ff6a00] transition-colors"
                >
                  <FiGrid className="h-4.5 w-4.5 text-gray-400" />
                  <span>Dashboard Home</span>
                </Link>

                <Link 
                  to="/account/orders" 
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#ff6a00] transition-colors"
                >
                  <FiShoppingBag className="h-4.5 w-4.5 text-gray-400" />
                  <span>My Orders</span>
                </Link>

                <Link 
                  to="/account/collections" 
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#ff6a00] transition-colors"
                >
                  <FiFolder className="h-4.5 w-4.5 text-gray-400" />
                  <span>My Collections</span>
                </Link>

                <Link 
                  to="/wishlist" 
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#ff6a00] transition-colors"
                >
                  <FiHeart className="h-4.5 w-4.5 text-gray-400" />
                  <span>My Wishlist</span>
                </Link>

                <Link 
                  to="/account/settings" 
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#ff6a00] transition-colors"
                >
                  <FiSettings className="h-4.5 w-4.5 text-gray-400" />
                  <span>Account Settings</span>
                </Link>

                <div className="my-1 border-t border-gray-50"></div>

                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="h-4.5 w-4.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/auth/login" 
              className="hidden sm:block text-sm font-bold text-gray-700 hover:text-[#ff6a00] transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/auth/register" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              <FiUser className="h-4 w-4" />
              <span>Register</span>
            </Link>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLogOut className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to leave?</h3>
                <p className="text-sm text-gray-500 mb-8">
                  You are about to securely sign out of your account.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-3 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmLogout}
                    className="px-4 py-3 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compare Icon */}
      <Link to="/compare" className="relative hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
        <FiRepeat className="h-5 w-5" />
        {compareItems?.length > 0 && (
          <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6a00] text-[10px] font-bold text-white shadow-sm border border-white">
            {compareItems.length}
          </span>
        )}
      </Link>

      {/* Wishlist Icon */}
      <Link to="/wishlist" className="relative hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
        <FiHeart className="h-5 w-5" />
        {wishlist?.length > 0 && (
          <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6a00] text-[10px] font-bold text-white shadow-sm border border-white">
            {wishlist.length}
          </span>
        )}
      </Link>

      {/* Notifications */}
      <NotificationBell />

      {/* Cart Icon & MiniCart */}
      <div 
        className="relative h-full py-4 -my-4"
        onMouseEnter={handleCartEnter}
        onMouseLeave={handleCartLeave}
      >
        <Link to="/cart" className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors group">
          <FiShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6a00] text-[10px] font-bold text-white shadow-sm border border-white">
              {cartCount}
            </span>
          )}
        </Link>
        {showMiniCart && <MiniCart isOpen={showMiniCart} onClose={() => setShowMiniCart(false)} />}
      </div>

      <CompareBar />
    </div>
  );
};

export default NavIcons;