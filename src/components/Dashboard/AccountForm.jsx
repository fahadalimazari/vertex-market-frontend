import { useState, useRef, useEffect } from 'react'
import { FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDashboard } from '../../context/Dashboard/DashboardContext'

const AccountForm = () => {
  const { userProfile, updateUserProfile, updateAvatar } = useDashboard()
  const [formData, setFormData] = useState(userProfile)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setFormData(userProfile)
  }, [userProfile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUserProfile(formData)
    toast.success('Profile updated successfully')
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      toast.loading('Uploading avatar...', { id: 'avatarUpload' })
      try {
        await updateAvatar(file)
        toast.success('Avatar updated successfully', { id: 'avatarUpload' })
      } catch (err) {
        toast.error('Avatar upload failed', { id: 'avatarUpload' })
      }
    }
  }

  const handleRemoveAvatar = () => {
    // Revert to a default avatar
    updateAvatar('https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.fullName) + '&background=ff6a00&color=fff')
    toast.success('Avatar removed')
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-gray-100">
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              type="button"
              onClick={handleAvatarClick}
              className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full focus:outline-none"
            >
              <FiCamera className="text-2xl" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[15px] font-bold text-gray-900">Profile Picture</h4>
            <p className="text-[13px] text-gray-500 max-w-sm">
              We support PNGs, JPEGs and GIFs under 10MB
            </p>
            <div className="flex items-center gap-3 mt-1">
              <button 
                type="button"
                onClick={handleAvatarClick}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors focus:outline-none"
              >
                <FiUpload /> Upload New
              </button>
              <button 
                type="button"
                onClick={handleRemoveAvatar}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors focus:outline-none"
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-[#ff6a00] text-white px-8 py-3 rounded-xl font-bold hover:brightness-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default AccountForm
