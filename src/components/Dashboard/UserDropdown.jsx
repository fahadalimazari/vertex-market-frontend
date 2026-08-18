import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi'
import { useDashboard } from '../../context/Dashboard/DashboardContext'
import LogoutModal from './LogoutModal'

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { userProfile } = useDashboard()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#ff6a00] hover:ring-2 hover:ring-[#ff6a00]/50 transition-all"
        >
          <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <p className="text-[14px] font-bold text-gray-900 truncate">{userProfile.fullName}</p>
              <p className="text-[12px] text-gray-500 truncate">{userProfile.email}</p>
            </div>
            
            <div className="p-2">
              <Link to="/account/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff6a00] transition-colors">
                <FiUser /> My Profile
              </Link>
              <Link to="/account/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff6a00] transition-colors">
                <FiPackage /> Orders
              </Link>
              <Link to="/account/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff6a00] transition-colors">
                <FiHeart /> Wishlist
              </Link>
              <Link to="/account/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff6a00] transition-colors">
                <FiSettings /> Settings
              </Link>
            </div>
            
            <div className="p-2 border-t border-gray-50">
              <button 
                onClick={() => {
                  setIsOpen(false)
                  setIsLogoutModalOpen(true)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
    </>
  )
}

export default UserDropdown
