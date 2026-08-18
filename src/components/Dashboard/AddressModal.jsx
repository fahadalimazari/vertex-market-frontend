import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { FiHome, FiBriefcase } from 'react-icons/fi'
import toast from 'react-hot-toast'

const AddressModal = ({ isOpen, onClose, onSave, editingAddress }) => {
  const [formData, setFormData] = useState({
    title: 'Home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  })

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress)
    } else {
      setFormData({
        title: 'Home',
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
      })
    }
  }, [editingAddress, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.street || !formData.city) {
      toast.error('Please fill in all required fields.')
      return
    }
    
    onSave(formData)
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingAddress ? 'Edit Address' : 'Add New Address'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Address Type Selection */}
        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-3">Address Label</label>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-colors ${formData.title === 'Home' ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              <input type="radio" name="title" value="Home" checked={formData.title === 'Home'} onChange={handleChange} className="sr-only" />
              <FiHome /> <span className="text-[14px] font-bold">Home</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-colors ${formData.title === 'Office' ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              <input type="radio" name="title" value="Office" checked={formData.title === 'Office'} onChange={handleChange} className="sr-only" />
              <FiBriefcase /> <span className="text-[14px] font-bold">Office</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Full Name *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Phone Number *</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="+92 300 1234567"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-2">Street Address *</label>
          <input 
            type="text" 
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
            placeholder="House / Apartment / Block"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[13px] font-bold text-gray-700 mb-2">City *</label>
            <input 
              type="text" 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="Karachi"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">State</label>
            <input 
              type="text" 
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="Sindh"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Zip Code</label>
            <input 
              type="text" 
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="75000"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-1 checked:bg-[#ff6a00] checked:border-[#ff6a00] transition-colors cursor-pointer"
            />
            <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            Set as default shipping address
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-[14px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-3 rounded-xl text-[14px] font-bold text-white bg-[#ff6a00] hover:brightness-95 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2"
          >
            Save Address
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddressModal
