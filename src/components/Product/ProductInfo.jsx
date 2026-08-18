import { memo } from 'react'
import { FiStar } from 'react-icons/fi'

const ProductInfo = ({ brand, name, rating, reviews, sold, sku, highlights }) => {
  const fullStars = Math.floor(rating || 0)

  return (
    <div className="flex flex-col gap-3">
      {/* Brand & SKU */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#ff6a00] uppercase tracking-wider">
          {typeof brand === 'object' ? brand?.name : brand}
        </span>
        <span className="text-[12px] text-gray-500">
          SKU: {sku || 'N/A'}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {name}
      </h1>

      {/* Rating & Sold */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex text-[#ffb800] text-[14px]">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                <FiStar className={i < fullStars ? 'fill-current' : ''} />
              </span>
            ))}
          </div>
          <span className="text-[13px] font-medium text-gray-700">
            {rating}
          </span>
          <span className="text-[13px] text-gray-500 hover:text-[#ff6a00] hover:underline cursor-pointer transition-colors">
            ({reviews} Reviews)
          </span>
        </div>
        
        <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
        
        <div className="text-[13px] text-gray-600">
          Sold <span className="font-bold text-gray-900">{sold ? sold.toLocaleString() : 0}</span>
        </div>
      </div>

      {/* Product Highlights Section */}
      {highlights && highlights.length > 0 && (
        <div className="mt-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-[14px] font-bold text-gray-900 mb-3">Key Highlights</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {highlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[13px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] mt-1.5 shrink-0"></span>
                <div>
                  <span className="text-gray-500">{hl.name}:</span>{' '}
                  <span className="font-medium text-gray-900">{hl.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

export default memo(ProductInfo)
