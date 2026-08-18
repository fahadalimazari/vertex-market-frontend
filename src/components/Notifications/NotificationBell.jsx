import { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    // ESC key listener to close dropdown
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowDropdown(false);
    };

    // Click outside handler
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={bellRef} className="relative flex items-center h-full">
      <button
        onClick={() => setShowDropdown(prev => !prev)}
        className="relative p-2 text-gray-600 hover:text-[#ff6a00] transition-colors focus:outline-none rounded-full hover:bg-gray-50"
        aria-label="View notifications"
        aria-expanded={showDropdown}
      >
        <FiBell className="text-[22px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-5 min-w-5 px-1.5 rounded-full bg-[#ff6a00] text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown onClose={() => setShowDropdown(false)} />
      )}
    </div>
  );
};

export default NotificationBell;
