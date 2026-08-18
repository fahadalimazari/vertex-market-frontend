import { memo } from 'react'
import ShippingForm from './ShippingForm'

const BillingAddress = ({ sameAsShipping, onChangeSameAsShipping, billingData, billingErrors, onChangeBillingData }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6">5. Billing Address</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <input 
          type="checkbox" 
          id="sameAsShipping"
          checked={sameAsShipping}
          onChange={(e) => onChangeSameAsShipping(e.target.checked)}
          className="w-4 h-4 text-[#ff6a00] bg-gray-50 border-gray-300 rounded focus:ring-[#ff6a00] focus:ring-2 cursor-pointer"
        />
        <label htmlFor="sameAsShipping" className="text-[14px] font-medium text-gray-700 cursor-pointer select-none">
          Billing address is same as shipping address
        </label>
      </div>

      {!sameAsShipping && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-900 mb-2">Country</label>
              <select 
                value={billingData.country}
                onChange={(e) => onChangeBillingData('country', e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${billingErrors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
              >
                <option value="">Select Country</option>
                <option value="Pakistan">Pakistan</option>
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-900 mb-2">Province / State</label>
              <input 
                type="text"
                value={billingData.province}
                onChange={(e) => onChangeBillingData('province', e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${billingErrors.province ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-900 mb-2">City</label>
              <input 
                type="text"
                value={billingData.city}
                onChange={(e) => onChangeBillingData('city', e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${billingErrors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-900 mb-2">Postal Code</label>
              <input 
                type="text"
                value={billingData.postalCode}
                onChange={(e) => onChangeBillingData('postalCode', e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${billingErrors.postalCode ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-gray-900 mb-2">Street Address</label>
              <input 
                type="text"
                value={billingData.address}
                onChange={(e) => onChangeBillingData('address', e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 transition-all ${billingErrors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#ff6a00]'}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(BillingAddress)
