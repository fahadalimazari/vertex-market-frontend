import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { authService } from '../../services/auth/authService'

const SecurityForm = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleShow = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }
  
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    try {
      setIsLoading(true);
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      toast.success('Password updated successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  }

  const strength = getPasswordStrength(formData.newPassword);
  
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Change Password</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
        
        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input 
              type={showPassword.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="Enter current password"
            />
            <button 
              type="button"
              onClick={() => toggleShow('current')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword.current ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input 
              type={showPassword.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="Enter new password"
            />
            <button 
              type="button"
              onClick={() => toggleShow('new')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword.new ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          {formData.newPassword && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px] font-medium text-gray-500">Password strength</span>
                <span className={`text-[12px] font-bold ${
                  strength < 50 ? 'text-red-500' : strength < 75 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {strength < 50 ? 'Weak' : strength < 75 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    strength < 50 ? 'bg-red-500' : strength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
            </div>
          )}
          <p className="text-[12px] text-gray-500 mt-2">Must be at least 8 characters long.</p>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <input 
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="Confirm new password"
            />
            <button 
              type="button"
              onClick={() => toggleShow('confirm')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="flex justify-start pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className={`bg-[#ff6a00] text-white px-8 py-3 rounded-xl font-bold hover:brightness-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SecurityForm
