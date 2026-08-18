import { Link } from 'react-router-dom';
import { FiBellOff } from 'react-icons/fi';

const EmptyNotifications = () => {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm max-w-md mx-auto">
      <div className="h-16 w-16 mx-auto mb-4 bg-orange-50 text-[#ff6a00] rounded-full flex items-center justify-center">
        <FiBellOff className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">You're All Caught Up</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
        No notifications to display right now. We'll alert you when there are new orders or announcements.
      </p>
      <Link
        to="/products"
        className="inline-flex justify-center bg-[#ff6a00] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#e05e00] transition-colors shadow-sm"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyNotifications;
