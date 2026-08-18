import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  if (!isOpen) return null

  const handleLogout = async () => {
    onClose()
    await logout()
    navigate('/')
  }


  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up p-6 text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
        >
          <FiX />
        </button>

        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
          <FiLogOut className="ml-1" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Logout of Vertex?</h3>
        <p className="text-[14px] text-gray-500 mb-8">
          You can always log back in at any time. Are you sure you want to log out?
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3.5 rounded-xl text-[14px] font-bold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm shadow-red-500/20"
          >
            Yes, Log Out
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
