import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FiCheckSquare, FiTrash2, FiBell, FiSettings, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications, markAsRead } = useNotifications();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter out archived
  const activeNotifications = notifications.filter(n => !n.isArchived);

  // Sort by priority (high first) and date (newest first)
  const sortedNotifications = [...activeNotifications].sort((a, b) => {
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    const aWeight = priorityWeights[a.priority] || 1;
    const bWeight = priorityWeights[b.priority] || 1;

    if (aWeight !== bWeight) {
      return bWeight - aWeight;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, 10); // Limit to latest 10

  const handleClearAll = () => {
    clearAllNotifications();
    setShowClearConfirm(false);
    onClose();
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const ms = now - past;
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return past.toLocaleDateString();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-100 shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
      {/* Top Header */}
      <div className="px-4 pb-2 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
          <p className="text-[10px] text-gray-500 font-semibold uppercase">
            {unreadCount} UNREAD ALERTS
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="p-1.5 hover:bg-orange-50 text-gray-500 hover:text-[#ff6a00] rounded-lg transition-colors disabled:opacity-50"
            title="Mark all read"
          >
            <FiCheckSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
            title="Clear all"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {sortedNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FiBell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-bold">All caught up!</p>
            <p className="text-[10px] text-gray-400 mt-0.5">No active notifications</p>
          </div>
        ) : (
          sortedNotifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id);
                onClose();
              }}
              className={`p-3.5 hover:bg-gray-50 transition-colors flex items-start gap-3 cursor-pointer relative ${
                notif.isRead ? '' : 'bg-orange-50/5'
              }`}
            >
              {/* Priority Dot */}
              <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                notif.isRead 
                  ? 'bg-transparent' 
                  : notif.priority === 'high' 
                    ? 'bg-red-500' 
                    : 'bg-[#ff6a00]'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                    {notif.category}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold leading-none">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>
                <h5 className={`text-xs font-bold text-gray-900 mt-1 truncate ${
                  notif.isRead ? '' : 'font-extrabold text-slate-900'
                }`}>
                  {notif.title}
                </h5>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer shortcut bar */}
      <div className="px-4 pt-2 border-t border-gray-50 flex items-center justify-between mt-1">
        <Link 
          to="/account/settings"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <FiSettings className="h-3.5 w-3.5" />
          <span>Preferences</span>
        </Link>
        <Link
          to="/account/notifications"
          onClick={onClose}
          className="text-[11px] font-bold text-[#ff6a00] hover:text-[#e05e00] transition-colors"
        >
          View All Notifications
        </Link>
      </div>

      {/* Clear All Confirmation Modal overlay */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-xl bg-white p-5 shadow-2xl border border-gray-100">
            <h5 className="text-sm font-bold text-gray-900">Clear Notifications?</h5>
            <p className="text-xs text-gray-500 mt-1">This will permanently delete all notifications list.</p>
            <div className="mt-4 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 border border-gray-200 text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
