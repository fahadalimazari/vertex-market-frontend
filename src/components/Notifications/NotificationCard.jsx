import { useNotifications } from '../../context/NotificationContext';
import { 
  FiPackage, FiCreditCard, FiHeart, FiShoppingCart, FiTag, 
  FiGift, FiCpu, FiShield, FiUser, FiServer, FiEye, FiArchive, 
  FiTrash2, FiRotateCcw 
} from 'react-icons/fi';

const categoryConfig = {
  orders: { icon: FiPackage, color: 'text-orange-500', bg: 'bg-orange-50' },
  payments: { icon: FiCreditCard, color: 'text-green-500', bg: 'bg-green-50' },
  wishlist: { icon: FiHeart, color: 'text-red-500', bg: 'bg-red-50' },
  cart: { icon: FiShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
  promotions: { icon: FiTag, color: 'text-purple-500', bg: 'bg-purple-50' },
  coupons: { icon: FiGift, color: 'text-pink-500', bg: 'bg-pink-50' },
  ai: { icon: FiCpu, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  security: { icon: FiShield, color: 'text-red-600', bg: 'bg-red-50' },
  account: { icon: FiUser, color: 'text-slate-500', bg: 'bg-slate-50' },
  system: { icon: FiServer, color: 'text-amber-500', bg: 'bg-amber-50' },
};

const NotificationCard = ({ notification, onOpenDetails }) => {
  const { markAsRead, archiveNotification, restoreNotification, deleteNotification } = useNotifications();

  const config = categoryConfig[notification.category] || categoryConfig.system;
  const CategoryIcon = config.icon;

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

  const getPriorityBadgeColor = (p) => {
    switch (p) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 relative group ${
        notification.isRead 
          ? 'bg-white border-gray-100' 
          : 'bg-orange-50/10 border-orange-100 shadow-[0_2px_12px_rgb(255,106,0,0.03)]'
      }`}
    >
      {/* Category Icon */}
      <div className={`p-3 rounded-xl ${config.bg} ${config.color} flex-shrink-0`}>
        <CategoryIcon className="h-5 w-5" />
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {notification.category}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${getPriorityBadgeColor(notification.priority)}`}>
            {notification.priority}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            • {timeAgo(notification.createdAt)}
          </span>
        </div>

        <h4 
          onClick={() => onOpenDetails(notification)}
          className={`text-sm font-bold text-gray-900 cursor-pointer hover:text-[#ff6a00] transition-colors truncate ${
            notification.isRead ? '' : 'font-extrabold'
          }`}
        >
          {notification.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        {/* Action Panel */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => onOpenDetails(notification)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#ff6a00] transition-colors"
          >
            <FiEye className="h-3.5 w-3.5" />
            <span>Open Details</span>
          </button>
          
          {!notification.isRead && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff6a00] hover:text-[#e05e00] transition-colors"
            >
              <span>Mark Read</span>
            </button>
          )}

          {notification.isArchived ? (
            <button
              onClick={() => restoreNotification(notification.id)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
              title="Restore to Inbox"
            >
              <FiRotateCcw className="h-3.5 w-3.5" />
              <span>Restore</span>
            </button>
          ) : (
            <button
              onClick={() => archiveNotification(notification.id)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
              title="Archive Notification"
            >
              <FiArchive className="h-3.5 w-3.5" />
              <span>Archive</span>
            </button>
          )}

          <button
            onClick={() => deleteNotification(notification.id)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-red-600 transition-colors ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Permanently"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Unread Status Indicator */}
      {!notification.isRead && (
        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#ff6a00]" />
      )}
    </div>
  );
};

export default NotificationCard;
