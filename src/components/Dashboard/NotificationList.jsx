import { FiBox, FiTag, FiShield, FiTrash2 } from 'react-icons/fi'

const NotificationList = ({ notifications, onMarkAsRead, onDelete }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'order': return <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><FiBox /></div>
      case 'promo': return <div className="w-10 h-10 rounded-full bg-orange-50 text-[#ff6a00] flex items-center justify-center"><FiTag /></div>
      case 'security': return <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><FiShield /></div>
      default: return <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center"><FiBox /></div>
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      {notifications.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500">You have no notifications.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-6 flex gap-4 transition-colors ${!notification.read ? 'bg-orange-50/30' : 'hover:bg-gray-50/50'}`}
            >
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h4 className={`text-[15px] font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[12px] text-gray-400 whitespace-nowrap">{notification.time}</span>
                </div>
                <p className={`text-[14px] ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  {!notification.read && (
                    <button 
                      onClick={() => onMarkAsRead(notification.id)}
                      className="text-[13px] font-bold text-[#ff6a00] hover:underline focus:outline-none"
                    >
                      Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(notification.id)}
                    className="flex items-center gap-1 text-[13px] font-medium text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
              {!notification.read && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#ff6a00] mt-2"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationList
