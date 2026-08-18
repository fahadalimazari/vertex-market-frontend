import { Link, useNavigate } from 'react-router-dom'
import { FiChevronRight, FiEye, FiPackage, FiClock, FiCheckCircle, FiHeart, FiTag, FiZap } from 'react-icons/fi'
import StatusBadge from '../../components/Dashboard/StatusBadge'
import { useDashboard } from '../../context/Dashboard/DashboardContext'
import { useNotifications } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'
import { FiBell } from 'react-icons/fi'

const DashboardStats = () => {
  const { getOrderStats, wishlist } = useDashboard()
  const stats = getOrderStats()
  const navigate = useNavigate()

  const statCards = [
    { 
      title: 'Total Orders', 
      value: stats.total, 
      icon: FiPackage, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      onClick: () => navigate('/account/orders')
    },
    { 
      title: 'Pending Orders', 
      value: stats.pending, 
      icon: FiClock, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      onClick: () => navigate('/account/orders?status=Pending')
    },
    { 
      title: 'Completed', 
      value: stats.completed, 
      icon: FiCheckCircle, 
      color: 'text-green-500', 
      bg: 'bg-green-50',
      onClick: () => navigate('/account/orders?status=Delivered')
    },
    { 
      title: 'Wishlist', 
      value: wishlist.length, 
      icon: FiHeart, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50',
      onClick: () => navigate('/account/wishlist')
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div 
            key={index} 
            onClick={stat.onClick}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#ff6a00]/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} text-xl group-hover:scale-110 transition-transform`}>
                <Icon />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-none mt-1">{stat.value}</h3>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const DashboardHome = () => {
  const { orders } = useDashboard()
  const { notifications } = useNotifications()
  const { user } = useAuth() || { user: { name: 'Customer' } }
  
  const recentOrders = orders.slice(0, 5)

  // Filter out archived, show latest 5
  const latestNotifications = notifications
    .filter(n => !n.isArchived)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff8c00] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Welcome back, {user?.name || 'Fahad'}!</h2>
          <p className="text-orange-100 max-w-lg mb-6">
            Discover today's AI-curated deals based on your browsing history, and track your recent orders in real-time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/account/orders" className="bg-white text-[#ff6a00] px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-orange-50 transition-colors">
              Track Order
            </Link>
            <Link to="/" className="bg-orange-800/20 text-white border border-orange-300/30 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-800/40 transition-colors">
              Start Shopping
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Orders & AI Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <Link to="/account/orders" className="text-[13px] font-bold text-[#ff6a00] hover:underline flex items-center gap-1">
                View All <FiChevronRight />
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Order ID</th>
                      <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Date</th>
                      <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Total</th>
                      <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Status</th>
                      <th className="py-4 px-6 text-[13px] font-bold text-gray-700 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900">{order.id}</td>
                        <td className="py-4 px-6 text-[14px] text-gray-600">
                          {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900">
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link 
                            to={`/account/orders/${order.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#ff6a00] hover:text-white transition-colors focus:outline-none" 
                            title="View Details"
                          >
                            <FiEye />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-[14px] text-gray-500">
                          No recent orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FiZap className="text-[#ff6a00] h-5 w-5 fill-orange-100" />
              <h3 className="text-lg font-bold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-full h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                    <FiPackage className="text-gray-300 h-8 w-8" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">Premium Smartwatch {item}</h4>
                  <p className="text-[#ff6a00] font-black mt-1">Rs. 12,500</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Alerts & Coupons */}
        <div className="space-y-8">
          
          {/* Coupons Widget */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <FiTag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-indigo-900">Available Coupons</h3>
                <p className="text-[11px] text-indigo-500 font-semibold">2 expiring soon</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="bg-white p-3 rounded-xl border border-indigo-50/50 border-dashed shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">WELCOME20</h4>
                  <p className="text-[10px] text-gray-500">20% off your first order</p>
                </div>
                <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Copy</button>
              </div>
              <div className="bg-white p-3 rounded-xl border border-indigo-50/50 border-dashed shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">FREESHIP</h4>
                  <p className="text-[10px] text-gray-500">Free shipping over Rs. 5000</p>
                </div>
                <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Copy</button>
              </div>
            </div>
          </div>

          {/* Latest Notifications Widget */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Latest Alerts</h3>
              <Link to="/account/notifications" className="text-[13px] font-bold text-[#ff6a00] hover:underline flex items-center gap-1">
                View All <FiChevronRight />
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3.5 min-h-[295px] flex flex-col justify-between">
              <div className="space-y-3">
                {latestNotifications.map(notif => (
                  <Link 
                    key={notif.id}
                    to="/account/notifications"
                    className="flex items-start gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="p-2 bg-orange-50 text-[#ff6a00] rounded-lg mt-0.5">
                      <FiBell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{notif.category}</span>
                        {!notif.isRead && <span className="h-1.5 w-1.5 bg-[#ff6a00] rounded-full" />}
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 truncate mt-0.5">{notif.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notif.message}</p>
                    </div>
                  </Link>
                ))}

                {latestNotifications.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <FiBell className="h-7 w-7 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs font-semibold">No recent alerts</p>
                  </div>
                )}
              </div>

              <Link
                to="/account/notifications"
                className="w-full text-center border border-gray-200 hover:border-[#ff6a00] text-gray-600 hover:text-[#ff6a00] py-2 rounded-xl text-xs font-bold transition-colors block mt-2"
              >
                Go to Notification Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome

