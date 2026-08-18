import { memo } from 'react'
import { Link } from 'react-router-dom'

const BrandList = ({ brands, categorySlug }) => {
  if (!brands || brands.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="text-gray-400 mb-2">No brands available</div>
        <div className="text-[12px] text-gray-500">Check back later for top brands.</div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <h3 className="text-[15px] font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
        Popular Brands
      </h3>
      <ul className="space-y-3">
        {brands.map((brand) => (
          <li key={brand.id}>
            <Link 
              to={`/categories/${categorySlug}?brand=${brand.slug}`}
              className="text-[13px] text-gray-600 hover:text-[#ff6a00] hover:underline transition-all flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#ff6a00] transition-colors"></div>
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>
      
      <Link 
        to={`/categories/${categorySlug}`} 
        className="inline-block mt-6 text-[13px] font-bold text-[#ff6a00] hover:underline"
      >
        Shop by Brand &rarr;
      </Link>
    </div>
  )
}

export default memo(BrandList)
