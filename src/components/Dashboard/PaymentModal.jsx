import { useState } from 'react'
import Modal from '../common/Modal'
import { FiCreditCard } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PaymentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nameOnCard || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      toast.error('Please fill in all required fields.')
      return
    }

    // Dummy card type logic based on starting number
    let type = 'Visa'
    if (formData.cardNumber.startsWith('5')) type = 'Mastercard'
    
    // Get last 4 digits
    const last4 = formData.cardNumber.slice(-4)

    const paymentData = {
      type,
      cardNumber: `**** **** **** ${last4}`,
      expiryDate: formData.expiryDate,
      nameOnCard: formData.nameOnCard,
      isDefault: formData.isDefault
    }
    
    onSave(paymentData)
    setFormData({
      nameOnCard: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      isDefault: false
    })
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Card"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center text-gray-400 mb-2">
          <FiCreditCard className="text-4xl" />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-2">Name on Card *</label>
          <input 
            type="text" 
            name="nameOnCard"
            value={formData.nameOnCard}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-700 mb-2">Card Number *</label>
          <input 
            type="text" 
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength="16"
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
            placeholder="4111 1111 1111 1111"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Expiry Date *</label>
            <input 
              type="text" 
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              maxLength="5"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">CVV *</label>
            <input 
              type="password" 
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="4"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10" 
              placeholder="123"
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
            Set as default payment method
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
            Add Card
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default PaymentModal
