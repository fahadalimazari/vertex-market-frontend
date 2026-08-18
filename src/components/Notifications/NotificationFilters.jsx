const filterTabs = [
  { id: 'all', label: 'All Inbox' },
  { id: 'unread', label: 'Unread' },
  { id: 'archived', label: 'Archived' },
];

const categoryTabs = [
  { id: 'orders', label: 'Orders' },
  { id: 'payments', label: 'Payments' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'ai', label: 'AI Suggestions' },
  { id: 'security', label: 'Security' },
  { id: 'system', label: 'System' },
];

const NotificationFilters = ({ activeFilter, onFilterChange, activeCategory, onCategoryChange }) => {
  return (
    <div className="space-y-4">
      {/* Inbox Status Tabs */}
      <div className="flex border-b border-gray-100 gap-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              onFilterChange(tab.id);
              // Reset category when changing main inbox tabs to avoid empty subsets
              onCategoryChange('all');
            }}
            className={`pb-3 text-xs font-bold transition-all relative border-b-2 ${
              activeFilter === tab.id
                ? 'border-[#ff6a00] text-[#ff6a00]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Horizontal Filter Tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar whitespace-nowrap">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            activeCategory === 'all'
              ? 'bg-[#ff6a00] border-[#ff6a00] text-white shadow-sm'
              : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
          }`}
        >
          All Categories
        </button>

        {categoryTabs.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeCategory === cat.id
                ? 'bg-[#ff6a00] border-[#ff6a00] text-white shadow-sm'
                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
          }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationFilters;
