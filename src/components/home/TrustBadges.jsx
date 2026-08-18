import { FiAward, FiCheckCircle, FiRefreshCcw, FiCreditCard, FiCpu } from 'react-icons/fi'

const TrustBadges = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="flex items-center gap-3 p-4 md:px-6">
          <FiAward className="text-2xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-gray-900 leading-tight truncate">Top Brands</div>
            <div className="text-[11px] text-gray-500 truncate">100% Original</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 md:px-6">
          <FiCheckCircle className="text-2xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-gray-900 leading-tight truncate">Best Prices</div>
            <div className="text-[11px] text-gray-500 truncate">Guaranteed</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 md:px-6">
          <FiRefreshCcw className="text-2xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-gray-900 leading-tight truncate">Easy Returns</div>
            <div className="text-[11px] text-gray-500 truncate">7 Days Policy</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 md:px-6">
          <FiCreditCard className="text-2xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-gray-900 leading-tight truncate">Secure Payment</div>
            <div className="text-[11px] text-gray-500 truncate">100% Protected</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 md:px-6">
          <FiCpu className="text-2xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-gray-900 leading-tight flex items-center gap-2 truncate">
              AI Assistant
              <span className="bg-[#ff6a00] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0">New</span>
            </div>
            <div className="text-[11px] text-gray-500 truncate">Shop Smarter</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustBadges
