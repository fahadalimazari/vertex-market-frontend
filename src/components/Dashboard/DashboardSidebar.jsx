import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiGrid, FiPackage, FiHeart, FiMapPin, FiCreditCard, FiBell, FiSettings, FiShield, FiLogOut, FiX, FiFolder, FiStar, FiGift, FiUsers, FiRotateCcw, FiDollarSign, FiMessageCircle } from 'react-icons/fi'
import UserProfileCard from './UserProfileCard'
import LogoutModal from './LogoutModal'
const navLinks = [
  { path: '/account', title: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/account/orders', title: 'My Orders', icon: FiPackage },
  { path: '/account/track-order', title: 'Track Order', icon: FiMapPin },
  { path: '/account/returns', title: 'Returns', icon: FiRotateCcw },
  { path: '/account/refunds', title: 'Refunds', icon: FiDollarSign },
  { path: '/account/support', title: 'Support Tickets', icon: FiMessageCircle },
  { path: '/account/wishlist', title: 'Wishlist', icon: FiHeart },
  { path: '/account/vouchers', title: 'Voucher Wallet', icon: FiGift },
  { path: '/account/referrals', title: 'Referral Rewards', icon: FiUsers },
  { path: '/account/reviews', title: 'My Reviews', icon: FiStar },
  { path: '/account/collections', title: 'Collections', icon: FiFolder },
  { path: '/account/addresses', title: 'Addresses', icon: FiMapPin },
  { path: '/account/payments', title: 'Payment Methods', icon: FiCreditCard },
  { path: '/account/notifications', title: 'Notifications', icon: FiBell },
  { path: '/account/settings', title: 'Account Settings', icon: FiSettings },
  { path: '/account/security', title: 'Security', icon: FiShield },
]


const DashboardSidebar = ({ onClose }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  return (
    <>
      <div className="h-full flex flex-col bg-white lg:bg-transparent lg:border-0 border-r border-gray-100 p-6 lg:p-0">
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="mb-8">
          <UserProfileCard />
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-[15px] ${
                  isActive 
                    ? 'bg-orange-50 text-[#ff6a00]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#ff6a00]'
                }`}
              >
                <Icon className="text-lg flex-shrink-0" />
                {link.title}
              </NavLink>
            )
          })}
          
          <div className="my-4 h-[1px] bg-gray-100"></div>
          
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-[15px] text-red-500 hover:bg-red-50 focus:outline-none text-left"
          >
            <FiLogOut className="text-lg flex-shrink-0" />
            Logout
          </button>
        </nav>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
    </>
  )
}

export default DashboardSidebar
