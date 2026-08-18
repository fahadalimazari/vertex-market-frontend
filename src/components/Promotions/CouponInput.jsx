import { memo, useState } from 'react';
import { FiTag, FiCheckCircle } from 'react-icons/fi';
import { usePromotions } from '../../hooks/usePromotions';

const CouponInput = memo(({ cartItems, subtotal }) => {
  const { applyCouponCode, isLoading } = usePromotions();
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    const success = await applyCouponCode(code.trim(), cartItems, subtotal);
    if (success) {
      setCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiTag className="text-gray-400" />
      </div>
      <input 
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Coupon or Voucher Code"
        className="w-full pl-11 pr-32 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 transition-all uppercase placeholder:normal-case"
      />
      <div className="absolute inset-y-0 right-1.5 flex items-center">
        <button 
          type="submit"
          disabled={!code.trim() || isLoading}
          className="px-6 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[calc(100%-8px)]"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </div>
    </form>
  );
});

CouponInput.displayName = 'CouponInput';
export default CouponInput;
