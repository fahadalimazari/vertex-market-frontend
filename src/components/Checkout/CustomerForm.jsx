import { memo } from 'react'

const CustomerForm = ({ data, errors, onChange }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6">1. Customer Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Full Name</label>
          <input 
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-[12px] text-red-500 mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Email Address</label>
          <input 
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Phone Number</label>
          <input 
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="03001234567"
          />
          {errors.phone && <p className="text-[12px] text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>
    </div>
  )
}

export default memo(CustomerForm)
