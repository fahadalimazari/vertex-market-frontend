import { useState } from 'react';
import { FiMapPin, FiTruck, FiCornerUpLeft, FiShield, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DeliveryCard = () => {
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('Karachi, Sindh');

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length < 4) {
      toast.error('Invalid postal code');
      return;
    }
    setCity('Delivery Location Available');
    toast.success('Shipping available for target area!');
  };

  return (
    <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm space-y-5 text-xs text-gray-700">
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 uppercase tracking-wider">
        Delivery Services
      </h3>

      {/* Address City Checker */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ship to location</span>
        <div className="flex items-center gap-2 border border-gray-200 p-2.5 rounded-xl bg-gray-50/50">
          <FiMapPin className="text-[#ff6a00] h-4.5 w-4.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{city}</p>
          </div>
        </div>

        <form onSubmit={handleCheckPincode} className="flex gap-2">
          <input
            type="text"
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none text-[11px]"
            placeholder="Postal Pincode e.g. 75400"
          />
          <button type="submit" className="bg-[#ff6a00] text-white px-3 py-2 rounded-lg font-bold text-[10px]">
            Check
          </button>
        </form>
      </div>

      {/* Logistics services */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-start gap-3">
          <FiTruck className="text-[#ff6a00] h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">Standard Delivery (Rs. 250)</p>
            <p className="text-gray-450 mt-0.5 text-[10px]">Estimated delivery: 2-3 business days.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiDollarSign className="text-green-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">Cash On Delivery Available</p>
            <p className="text-gray-450 mt-0.5 text-[10px]">Pay at your doorstep upon receiving the package.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-gray-55 pt-3">
          <FiCornerUpLeft className="text-[#ff6a00] h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">7 Days Easy Return Policy</p>
            <p className="text-gray-450 mt-0.5 text-[10px]">Hassle-free change of mind return if seal is not broken.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiShield className="text-[#ff6a00] h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">1 Year Brand Warranty</p>
            <p className="text-gray-450 mt-0.5 text-[10px]">Official local distributor warranty service centers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
