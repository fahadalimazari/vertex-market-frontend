import { memo } from 'react'

const ShippingForm = ({ data, errors, onChange }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6">2. Shipping Address</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Country</label>
          <select 
            value={data.country}
            onChange={(e) => onChange('country', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
          >
            <option value="">Select Country</option>
            <option value="Pakistan">Pakistan</option>
            <option value="UAE">UAE</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
          </select>
          {errors.country && <p className="text-[12px] text-red-500 mt-1">{errors.country}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Province / State</label>
          <input 
            type="text"
            value={data.province}
            onChange={(e) => onChange('province', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.province ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="Sindh"
          />
          {errors.province && <p className="text-[12px] text-red-500 mt-1">{errors.province}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">City</label>
          <input 
            type="text"
            value={data.city}
            onChange={(e) => onChange('city', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="Karachi"
          />
          {errors.city && <p className="text-[12px] text-red-500 mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Postal Code</label>
          <input 
            type="text"
            value={data.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.postalCode ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="75200"
          />
          {errors.postalCode && <p className="text-[12px] text-red-500 mt-1">{errors.postalCode}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Street Address</label>
          <input 
            type="text"
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
            placeholder="House # 123, Street 4, Block 5"
          />
          {errors.address && <p className="text-[12px] text-red-500 mt-1">{errors.address}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[13px] font-semibold text-gray-900 mb-2">Apartment, suite, etc. (Optional)</label>
          <input 
            type="text"
            value={data.apartment}
            onChange={(e) => onChange('apartment', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all"
            placeholder="Apartment 4B"
          />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <input 
          type="checkbox" 
          id="saveAddress"
          checked={data.saveAddress}
          onChange={(e) => onChange('saveAddress', e.target.checked)}
          className="w-4 h-4 text-[#ff6a00] bg-gray-50 border-gray-300 rounded focus:ring-[#ff6a00] focus:ring-2 cursor-pointer"
        />
        <label htmlFor="saveAddress" className="text-[13px] text-gray-700 cursor-pointer select-none">
          Save this address to my profile
        </label>
      </div>
    </div>
  )
}

export default memo(ShippingForm)
