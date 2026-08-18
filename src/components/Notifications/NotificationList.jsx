import { useState, useMemo } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationCard from './NotificationCard';
import NotificationFilters from './NotificationFilters';
import NotificationSearch from './NotificationSearch';
import NotificationDetails from './NotificationDetails';
import EmptyNotifications from './EmptyNotifications';
import { FiSliders, FiTrash2, FiCheckSquare } from 'react-icons/fi';

const NotificationList = () => {
  const { notifications, markAllAsRead, clearAllNotifications } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, archived
  const [activeCategory, setActiveCategory] = useState('all'); // all, or specific categories
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, unread, priority
  
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Filtered Notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // 1. Search Query Match
      const matchesSearch = 
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Inbox Filter Match
      if (activeFilter === 'unread' && (notif.isRead || notif.isArchived)) return false;
      if (activeFilter === 'archived' && !notif.isArchived) return false;
      // 'all' represents active inbox (not archived)
      if (activeFilter === 'all' && notif.isArchived) return false;

      // 3. Category Match
      if (activeCategory !== 'all' && notif.category !== activeCategory) return false;

      return true;
    });
  }, [notifications, searchQuery, activeFilter, activeCategory]);

  // Sorted Notifications list
  const sortedNotifications = useMemo(() => {
    const list = [...filteredNotifications];
    
    const priorityWeights = { high: 3, medium: 2, low: 1 };

    switch (sortBy) {
      case 'oldest':
        return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'unread':
        return list.sort((a, b) => {
          if (a.isRead === b.isRead) {
            return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort by date
          }
          return a.isRead ? 1 : -1;
        });
      case 'priority':
        return list.sort((a, b) => {
          const aWeight = priorityWeights[a.priority] || 1;
          const bWeight = priorityWeights[b.priority] || 1;
          if (aWeight === bWeight) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return bWeight - aWeight;
        });
      case 'newest':
      default:
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [filteredNotifications, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header and Bulk Operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-xs text-gray-500 mt-1">Manage and view system alerts and communications</p>
        </div>

        {/* Bulk Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            disabled={notifications.filter(n => !n.isRead && !n.isArchived).length === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#ff6a00] hover:bg-orange-50/50 px-3 py-2 border border-gray-100 rounded-xl transition-all disabled:opacity-50"
          >
            <FiCheckSquare className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={() => window.confirm('Are you sure you want to permanently delete all notifications?') && clearAllNotifications()}
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50/50 px-3 py-2 border border-red-100 rounded-xl transition-all"
          >
            <FiTrash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Advanced search, filters & sorting block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div className="md:col-span-3">
          <NotificationSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2.5 rounded-xl">
          <FiSliders className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-bold text-gray-700 outline-none border-none cursor-pointer pr-1 w-full"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="unread">Sort: Unread First</option>
            <option value="priority">Sort: Priority High First</option>
          </select>
        </div>
      </div>

      {/* Filters and List */}
      <div className="space-y-4">
        <NotificationFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {sortedNotifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <div className="space-y-3">
            {sortedNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onOpenDetails={setSelectedNotification}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default NotificationList;
