import { memo, useState } from 'react'

const ShippingCalculator = ({ onCalculate }) => {
  const [address, setAddress] = useState({
    country: 'Pakistan',
    state: '',
    city: '',
    postalCode: ''
  })

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (address.state.trim() && address.city.trim()) {
      onCalculate(address)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-gray-50 border border-gray-150 rounded-xl p-4">
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Country</label>
        <select
          name="country"
          value={address.country}
          onChange={handleChange}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all"
        >
          <option value="Pakistan">Pakistan</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Province/State</label>
          <select
            name="state"
            value={address.state}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all"
          >
            <option value="">Select State</option>
            <option value="Sindh">Sindh</option>
            <option value="Punjab">Punjab</option>
            <option value="Khyber Pakhtunkhwa">KPK (Khyber Pakhtunkhwa)</option>
            <option value="Balochistan">Balochistan</option>
            <option value="Gilgit Baltistan">Gilgit Baltistan</option>
            <option value="Azad Kashmir">Azad Kashmir</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Karachi"
            value={address.city}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          placeholder="e.g. 75500"
          value={address.postalCode}
          onChange={handleChange}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-2 bg-gray-900 text-white py-2 rounded-lg text-[13px] font-bold hover:bg-gray-800 transition-colors focus:outline-none"
      >
        Calculate Shipping
      </button>
    </form>
  )
}

export default memo(ShippingCalculator)
