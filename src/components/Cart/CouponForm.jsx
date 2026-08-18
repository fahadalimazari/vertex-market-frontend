import { memo, useState } from 'react'

const CouponForm = ({ onApplyCoupon }) => {
  const [code, setCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) {
      onApplyCoupon(code.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input 
        type="text" 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Coupon Code"
        className="w-full sm:flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all"
      />
      <button 
        type="submit"
        className="w-full sm:w-auto bg-gray-900 text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
      >
        Apply
      </button>
    </form>
  )
}

export default memo(CouponForm)
