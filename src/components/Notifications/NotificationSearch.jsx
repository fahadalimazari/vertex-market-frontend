import { FiSearch } from 'react-icons/fi';

const NotificationSearch = ({ value, onChange }) => {
  return (
    <div className="relative rounded-xl shadow-sm w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <FiSearch className="h-4.5 w-4.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-4 py-2.5 text-xs text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] focus:border-[#ff6a00] bg-white transition-all placeholder:text-gray-400 outline-none"
        placeholder="Search notifications by title or description..."
      />
    </div>
  );
};

export default NotificationSearch;
