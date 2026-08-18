import { memo } from 'react';
import { FiGift, FiCopy, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const VoucherCard = memo(({ voucher, isCollected, onCollect }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    toast.success('Voucher code copied!');
  };

  return (
    <div className={`bg-white rounded-xl border ${isCollected ? 'border-green-500' : 'border-gray-200'} p-5 relative overflow-hidden transition-all hover:shadow-md`}>
      {/* Background shape */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ff6a00]/5 rounded-full blur-2xl"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
            {voucher.sellerLogo ? (
              <img src={voucher.sellerLogo} alt={voucher.sellerName} className="w-full h-full object-cover" />
            ) : (
              <FiGift className="text-[#ff6a00]" size={20} />
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {voucher.type} Voucher
            </span>
            <h4 className="font-bold text-gray-900 mt-1">{voucher.sellerName}</h4>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-[#ff6a00]">
            {voucher.discountType === 'percentage' ? `${voucher.value}%` : `$${voucher.value}`}
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">OFF</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 relative z-10">{voucher.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4 relative z-10 bg-gray-50 p-2 rounded-lg">
        <div>Min. Spend: ${voucher.minimumOrder || 0}</div>
        <div className="font-medium text-gray-900">Valid: {voucher.validityDays} Days</div>
      </div>

      {isCollected ? (
        <div className="flex gap-2 relative z-10">
          <div className="flex-1 border border-green-200 bg-green-50 text-green-700 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm">
            <FiCheckCircle /> Saved in Wallet
          </div>
          <button 
            onClick={handleCopy}
            className="w-12 border border-gray-200 bg-white text-gray-600 hover:text-[#ff6a00] hover:border-[#ff6a00] rounded-lg flex items-center justify-center transition-colors"
            title="Copy Code"
          >
            <FiCopy />
          </button>
        </div>
      ) : (
        <button
          onClick={() => onCollect(voucher)}
          disabled={voucher.status !== 'active'}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors relative z-10 ${
            voucher.status !== 'active'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          Collect Voucher
        </button>
      )}
    </div>
  );
});

VoucherCard.displayName = 'VoucherCard';
export default VoucherCard;
