import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';

const AddressModal = ({ isOpen, onClose, editAddress = null }) => {
  const { addAddress } = useCheckout(); // Can be expanded for editAddress
  const [formData, setFormData] = useState(
    editAddress || {
      fullName: '',
      phone: '',
      addressLine1: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Pakistan',
      isDefault: false
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editAddress) {
      // In a real app we'd call updateAddress from context/service here
      // For now we simulate it or just let addAddress create a new one for mock
    } else {
      await addAddress(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">
            {editAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
              placeholder="e.g. Fahad Mazari"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              required
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
              placeholder="e.g. 0300-1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input 
              required
              type="text" 
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
              placeholder="House, Street, Area"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                required
                type="text" 
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province/State</label>
              <input 
                required
                type="text" 
                name="province"
                value={formData.province || formData.state || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                placeholder="Province/State"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input 
                required
                type="text" 
                name="postalCode"
                value={formData.postalCode || formData.zip || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                placeholder="Postal Code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                required
                type="text" 
                name="country"
                value={formData.country || 'Pakistan'}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                placeholder="Country"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4 text-[#ff6a00] rounded border-gray-300 focus:ring-[#ff6a00]"
            />
            <span className="text-sm text-gray-700">Set as default address</span>
          </label>

          <button 
            type="submit"
            className="w-full mt-4 bg-[#ff6a00] text-white font-bold py-3 rounded-xl hover:bg-[#e65c00] transition-colors"
          >
            {editAddress ? 'Update Address' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
