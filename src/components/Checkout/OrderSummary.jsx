import { memo } from 'react'
import { FiCheck } from 'react-icons/fi'
import DiscountBreakdown from '../Promotions/DiscountBreakdown'

const OrderSummary = ({ cartItems, subtotal, discount, tax, shippingMethodData, grandTotal, onPlaceOrder, isSubmitting }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-600">Items ({cartItems.length})</span>
          <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <DiscountBreakdown subtotal={subtotal} />
        
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-600">Estimated Tax</span>
          <span className="font-bold text-gray-900">Rs. {tax.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-600">Shipping ({shippingMethodData?.name || 'Standard'})</span>
          <span className="font-bold text-gray-900">
            {shippingMethodData?.price === 0 ? 'Free' : `Rs. ${(shippingMethodData?.price || 0).toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-100 my-6"></div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-[16px] font-bold text-gray-900">Grand Total</span>
        <span className="text-[22px] font-bold text-[#ff6a00]">Rs. {grandTotal.toLocaleString()}</span>
      </div>

      <button 
        onClick={onPlaceOrder}
        disabled={isSubmitting}
        className="w-full bg-[#ff6a00] text-white py-4 rounded-xl text-[15px] font-bold hover:bg-[#e65c00] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] shadow-sm shadow-[#ff6a00]/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <>
            <FiCheck className="text-xl" />
            Place Order
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-500 text-center mt-4 leading-tight">
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}

export default memo(OrderSummary)
