import { useState } from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { FiTag, FiX } from 'react-icons/fi';

const CouponBox = () => {
  const { applyCoupon, removeCoupon, coupon, isLoading } = useCheckout();
  const [code, setCode] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    const success = await applyCoupon(code);
    if (success) {
      setCode('');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FiTag className="text-[#ff6a00]" /> Have a coupon?
      </h3>

      {coupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
          <div>
            <span className="font-bold text-green-700">{coupon.code}</span>
            <p className="text-xs text-green-600">
              {coupon.type === 'percentage' ? `${coupon.value}% off applied` : `Rs. ${coupon.value} off applied`}
            </p>
          </div>
          <button 
            onClick={removeCoupon}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none uppercase"
          />
          <button 
            type="submit"
            disabled={!code.trim() || isLoading}
            className={`px-6 py-2 rounded-xl font-bold text-white transition-colors ${
              !code.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CouponBox;
