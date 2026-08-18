import { memo } from 'react';
import { FiTag, FiMinusCircle } from 'react-icons/fi';
import { usePromotions } from '../../hooks/usePromotions';

const DiscountBreakdown = memo(({ subtotal, eligibleMarketplaceSubtotal, eligibleSellerSubtotal }) => {
  const { activeMarketplaceCoupon, activeSellerCoupon, calculateDiscounts, removeActiveCoupon } = usePromotions();

  const discounts = calculateDiscounts(subtotal, eligibleMarketplaceSubtotal, eligibleSellerSubtotal);

  if (!activeMarketplaceCoupon && !activeSellerCoupon) return null;

  return (
    <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 text-green-700 font-bold mb-3 text-sm">
        <FiTag /> Applied Promotions
      </div>
      
      <div className="space-y-2">
        {activeMarketplaceCoupon && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">{activeMarketplaceCoupon.code}</span>
              <button 
                onClick={() => removeActiveCoupon('marketplace')}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove Coupon"
              >
                <FiMinusCircle size={14} />
              </button>
            </div>
            <span className="text-green-600 font-bold">-${discounts.marketplaceDiscount.toFixed(2)}</span>
          </div>
        )}

        {activeSellerCoupon && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">{activeSellerCoupon.code} <span className="text-[10px] bg-white px-1 py-0.5 rounded text-gray-500 border border-gray-200">Seller</span></span>
              <button 
                onClick={() => removeActiveCoupon('seller')}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove Seller Coupon"
              >
                <FiMinusCircle size={14} />
              </button>
            </div>
            <span className="text-green-600 font-bold">-${discounts.sellerDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-green-200/50 flex justify-between items-center">
        <span className="text-sm font-bold text-gray-900">Total Savings</span>
        <span className="text-sm font-black text-green-600">-${discounts.totalDiscount.toFixed(2)}</span>
      </div>
    </div>
  );
});

DiscountBreakdown.displayName = 'DiscountBreakdown';
export default DiscountBreakdown;
