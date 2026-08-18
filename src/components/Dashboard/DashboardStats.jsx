import { FiPackage, FiClock, FiCheckCircle, FiHeart } from 'react-icons/fi'
import { userProfile } from '../../data/user'

const DashboardStats = () => {
  const { stats } = userProfile

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: FiClock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Completed', value: stats.completedOrders, icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Wishlist', value: stats.wishlistItems, icon: FiHeart, color: 'text-rose-500', bg: 'bg-rose-50' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} text-xl`}>
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

export default DashboardStats
