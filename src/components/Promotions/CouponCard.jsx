import { memo } from 'react';
import { FiTag, FiClock, FiCheckCircle } from 'react-icons/fi';
import { usePromotions } from '../../hooks/usePromotions';

const CouponCard = memo(({ coupon, isCollected, onCollect }) => {
  const { applyCouponCode, activeMarketplaceCoupon, activeSellerCoupon } = usePromotions();

  // Determine if it is currently applied
  const isApplied = activeMarketplaceCoupon?.code === coupon.code || activeSellerCoupon?.code === coupon.code;

  const handleAction = () => {
    if (isApplied) return;
    if (onCollect) {
      onCollect(coupon);
    } else {
      applyCouponCode(coupon.code, [], 0); // Need cart context for full validation, but here we trigger the generic apply
    }
  };

  const getBadgeColor = () => {
    switch (coupon.type) {
      case 'marketplace': return 'bg-[#ff6a00] text-white';
      case 'seller': return 'bg-purple-500 text-white';
      case 'category': return 'bg-blue-500 text-white';
      default: return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className={`relative bg-white rounded-xl border ${isApplied ? 'border-[#ff6a00] shadow-md ring-1 ring-[#ff6a00]' : 'border-gray-200'} p-5 flex flex-col justify-between transition-all hover:shadow-md`}>
      {/* Decorative dashed edge */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full border-r border-gray-200"></div>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${getBadgeColor()}`}>
            {coupon.type}
          </span>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6a00] flex-shrink-0">
          <FiTag size={20} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FiClock />
            <span>Valid till {new Date(coupon.validTo).toLocaleDateString()}</span>
          </div>
          <div>Min Spend: ${coupon.minimumOrder || 0}</div>
        </div>

        <button
          onClick={handleAction}
          disabled={isApplied || coupon.status !== 'active'}
          className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            isApplied 
              ? 'bg-green-50 text-green-600 cursor-not-allowed'
              : coupon.status !== 'active'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#ff6a00] text-white hover:bg-[#e65c00]'
          }`}
        >
          {isApplied ? <><FiCheckCircle /> Applied</> : onCollect ? (isCollected ? 'Collected' : 'Collect') : 'Apply Coupon'}
        </button>
      </div>
    </div>
  );
});

CouponCard.displayName = 'CouponCard';
export default CouponCard;
