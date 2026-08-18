import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCreditCard, FiTag, FiTruck, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import CouponForm from './CouponForm'
import ShippingCalculator from './ShippingCalculator'

const CartSummary = ({ summary }) => {
  const { applyCoupon, removeCoupon, updateShippingAddress } = useCart();
  
  const itemsTotal = summary?.itemsTotal || 0;
  const discountTotal = summary?.discountTotal || 0;
  const couponDiscount = summary?.couponDiscount || 0;
  const tax = summary?.tax || 0;
  const shipping = summary?.shippingFee || 0;
  const grandTotal = summary?.grandTotal || 0;
  const appliedCoupon = summary?.appliedCoupon || null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 flex flex-col gap-6">
      <h2 className="text-[18px] font-bold text-gray-900 pb-4 border-b border-gray-100">Order Summary</h2>
      
      {/* Price breakdown */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-gray-900">Rs. {itemsTotal.toLocaleString()}</span>
        </div>
        
        {discountTotal > 0 && (
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-600">Item Discount</span>
            <span className="font-bold text-red-500">- Rs. {discountTotal.toLocaleString()}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-600 flex items-center gap-1"><FiTag className="text-[#ff6a00]" /> Coupon Discount</span>
            <span className="font-bold text-[#ff6a00]">- Rs. {couponDiscount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-600">Estimated Tax</span>
          <span className="font-bold text-gray-900">Rs. {tax.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-600">Shipping</span>
          <span className="font-bold text-gray-900">
            {shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="h-[1px] bg-gray-100"></div>

      {/* Coupon system */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5"><FiTag /> Promo Code</label>
        {summary?.couponWarning && (
          <div className="text-[11px] text-red-500 font-medium bg-red-50 p-2 rounded">
            {summary.couponWarning}
          </div>
        )}
        {couponDiscount > 0 ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-100 text-green-800 rounded-xl p-3 text-[13px]">
            <span className="font-bold">Active Coupon Applied</span>
            <button 
              onClick={removeCoupon}
              className="text-gray-500 hover:text-red-500 transition-colors p-1"
              aria-label="Remove coupon"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        ) : (
          <CouponForm onApplyCoupon={applyCoupon} />
        )}
      </div>

      <div className="h-[1px] bg-gray-100"></div>

      {/* Shipping calculator */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5"><FiTruck /> Estimate Shipping</label>
        <ShippingCalculator onCalculate={updateShippingAddress} />
      </div>

      <div className="h-[1px] bg-gray-100"></div>

      {/* Grand total */}
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-bold text-gray-900">Grand Total</span>
        <span className="text-[22px] font-bold text-[#ff6a00]">Rs. {grandTotal.toLocaleString()}</span>
      </div>

      <Link 
        to="/checkout"
        className="w-full bg-[#ff6a00] text-white py-4 rounded-xl text-[15px] font-bold hover:bg-[#e65c00] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] shadow-sm shadow-[#ff6a00]/20"
      >
        <FiCreditCard className="text-xl" />
        Proceed to Checkout
      </Link>
    </div>
  )
}

export default memo(CartSummary)

