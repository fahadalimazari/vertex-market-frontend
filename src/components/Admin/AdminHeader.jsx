import { useState } from 'react';
import { useAdmin } from '../../context/Admin/AdminContext';
import { useRole } from '../../context/Admin/RoleContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiSearch, FiBell, FiMessageSquare, FiPlus, 
  FiMoon, FiSun, FiSettings, FiChevronRight, FiMenu, FiX, FiCamera
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminHeader = ({ onMenuClick }) => {
  const { adminUser, updateAdminSession } = useAdmin();
  const { currentRole } = useRole();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name || '',
    avatar: adminUser?.avatar || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const res = await axios.put('https://vertex-market-backend.vercel.app/api/v1/auth/profile', profileForm, {
        headers: { Authorization: `Bearer ${adminUser.token}` }
      });
      if (res.data.success) {
        updateAdminSession({
          name: res.data.data.name,
          avatar: res.data.data.avatar
        });
        toast.success('Profile updated successfully!');
        setIsProfileModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.substring(0, 2).toUpperCase();
  };

  const formatPathName = (name) => name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Generate Breadcrumbs from URL
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 lg:h-20">
        
        {/* Left: Breadcrumbs & Search Trigger */}
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onMenuClick}
          >
            <FiMenu size={24} />
          </button>
          
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-500 capitalize">
            <Link to="/admin" className="hover:text-orange-600 transition-colors">Admin</Link>
            {pathnames.slice(1).map((name, index) => {
              const isLast = index === pathnames.length - 2;
              return (
                <div key={name} className="flex items-center gap-2">
                  <FiChevronRight className="flex-shrink-0 mx-2 text-gray-400" size={16} />
                  <span className={`text-sm font-medium ${isLast ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
                    {formatPathName(name)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl px-4 lg:px-8 hidden md:block">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search anything (Press '/' to focus)" 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-orange-500 rounded-xl text-sm transition-all duration-300 outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="hidden lg:flex items-center justify-center w-5 h-5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-300">/</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          
          <div className="hidden md:flex items-center gap-2 sm:gap-4 border-r border-gray-200 dark:border-gray-700 pr-4">
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              title="Toggle Theme"
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button className="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center transition-colors">
              <FiMessageSquare size={20} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-50 hover:text-orange-500 flex items-center justify-center transition-colors relative"
              >
                <FiBell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <span className="text-sm font-bold text-gray-900">Notifications</span>
                      <button className="text-[10px] text-orange-600 font-bold uppercase tracking-wider hover:underline">Mark All Read</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                          <p className="text-xs font-bold text-gray-900 mb-1">New Order Received</p>
                          <p className="text-[11px] text-gray-500">Order #ORD-2993 from Alex M.</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">2 mins ago</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 bg-gray-50">
                      <button className="w-full text-center text-xs font-bold text-gray-700 py-1.5 hover:text-gray-900 transition-colors">View All Notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button className="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center transition-colors">
              <FiSettings size={20} />
            </button>
          </div>

          <div 
            className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setProfileForm({ name: adminUser?.name || '', avatar: adminUser?.avatar || '' });
              setIsProfileModalOpen(true);
            }}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{adminUser?.name || 'Administrator'}</p>
              <span className="text-[10px] text-orange-600 dark:text-orange-500 font-bold uppercase tracking-wider block mt-1">
                {currentRole}
              </span>
            </div>
            {adminUser?.avatar ? (
              <img src={adminUser.avatar} alt="Admin" className="h-10 w-10 rounded-xl object-cover shadow-md border border-gray-200" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-950 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {getInitials(adminUser?.name)}
              </div>
            )}
          </div>
        </div>
        </div>
      </header>

      <CommandPalette />

      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h2>
                <button onClick={() => setIsProfileModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-orange-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Avatar Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition-colors mt-4"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminHeader;
