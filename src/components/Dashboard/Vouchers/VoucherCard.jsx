import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck, FiClock, FiTag } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const VoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { applyCoupon } = useCart();
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseVoucher = async () => {
    try {
      setIsApplying(true);
      await applyCoupon(voucher.code);
      toast.success('Voucher applied to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to apply voucher');
    } finally {
      setIsApplying(false);
    }
  };

  const getDiscountDisplay = () => {
    if (voucher.discountType === 'PERCENTAGE') return `${voucher.discountValue}% OFF`;
    if (voucher.discountType === 'FIXED') return `Rs. ${voucher.discountValue} OFF`;
    if (voucher.discountType === 'FREE_SHIPPING') return 'FREE SHIPPING';
    return `${voucher.discountValue} OFF`;
  };

  return (
    <div className={`border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
      voucher.status === 'Available' ? 'bg-white border-gray-200 hover:border-[#ff6a00] hover:shadow-md' : 'bg-gray-50 border-gray-100 opacity-80'
    }`}>
      {/* Visual left dash styling common in vouchers */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${
        voucher.status === 'Available' ? 'bg-[#ff6a00]' : 'bg-gray-300'
      }`}></div>

      <div className="flex justify-between items-start mb-4 pl-3">
        <div>
          <h3 className={`text-xl font-bold ${voucher.status === 'Available' ? 'text-gray-900' : 'text-gray-500'}`}>
            {getDiscountDisplay()}
          </h3>
          <p className="text-[14px] text-gray-500 mt-1 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
            {voucher.code}
          </p>
        </div>
        
        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg tracking-wider ${
          voucher.status === 'Available' ? 'bg-green-100 text-green-700' :
          voucher.status === 'Expired' ? 'bg-red-50 text-red-600' :
          'bg-gray-200 text-gray-600'
        }`}>
          {voucher.status}
        </span>
      </div>

      <div className="space-y-2 mb-6 pl-3">
        {voucher.minPurchase > 0 && (
          <p className="text-[13px] text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            Minimum Spend: Rs. {voucher.minPurchase.toLocaleString()}
          </p>
        )}
        {voucher.maxDiscount && (
          <p className="text-[13px] text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            Maximum Discount: Rs. {voucher.maxDiscount.toLocaleString()}
          </p>
        )}
        <p className="text-[13px] text-gray-600 flex items-center gap-2">
          <FiClock className="text-gray-400" />
          Valid Until: {new Date(voucher.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="flex gap-3 pl-3 pt-4 border-t border-dashed border-gray-200">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-[14px]"
        >
          {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        
        {voucher.status === 'Available' && (
          <button
            onClick={handleUseVoucher}
            disabled={isApplying}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ff6a00] text-white font-bold hover:brightness-95 transition-colors text-[14px] ${
              isApplying ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isApplying ? 'Applying...' : 'Use Voucher'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
