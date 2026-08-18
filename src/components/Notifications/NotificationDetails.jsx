import { useEffect } from 'react';
import { FiX, FiExternalLink, FiCpu, FiPackage, FiGift, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useAI } from '../../context/AIContext';

const NotificationDetails = ({ notification, onClose }) => {
  const { markAsRead } = useNotifications();
  const { setIsOpen: setAIChatOpen } = useAI();
  const navigate = useNavigate();

  useEffect(() => {
    if (!notification) return;
    
    // Automatically mark read when details are opened
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Keyboard ESC key close listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notification, onClose, markAsRead]);

  if (!notification) return null;

  const handleCtaClick = () => {
    onClose();
    if (notification.category === 'ai') {
      setAIChatOpen(true);
    } else {
      navigate(notification.link);
    }
  };

  const getCtaLabel = () => {
    switch (notification.category) {
      case 'orders':
        return 'Track Order Details';
      case 'wishlist':
        return 'Open Product Page';
      case 'coupons':
        return 'Apply Coupon Code';
      case 'promotions':
        return 'View Promotions';
      case 'ai':
        return 'Open AI Shopping Assistant';
      default:
        return 'View Page';
    }
  };

  const getCtaIcon = () => {
    switch (notification.category) {
      case 'orders':
        return FiPackage;
      case 'coupons':
        return FiGift;
      case 'promotions':
        return FiTag;
      case 'ai':
        return FiCpu;
      default:
        return FiExternalLink;
    }
  };

  const CtaIcon = getCtaIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close details"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Modal Info */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff6a00] bg-orange-50 px-2 py-1 rounded">
              {notification.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-3 pr-6 leading-snug">
              {notification.title}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">
              Sent on {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="w-full h-[1px] bg-gray-100" />

          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {notification.message}
            </p>
          </div>

          {/* Dynamic CTA Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4.5 py-2.5 border border-gray-200 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCtaClick}
              className="px-5 py-2.5 bg-[#ff6a00] text-white text-sm font-bold rounded-xl hover:bg-[#e05e00] transition-colors shadow-md flex items-center gap-2"
            >
              <CtaIcon className="h-4.5 w-4.5" />
              <span>{getCtaLabel()}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationDetails;
