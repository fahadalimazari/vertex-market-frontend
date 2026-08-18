import { FiSearch, FiPackage, FiGrid, FiArrowRight, FiStar } from 'react-icons/fi'
import { useSearch } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'

// Highlight helper component
const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>
  
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <span key={i} className="text-[#ff6a00] bg-orange-50 font-black">{part}</span> : part
      )}
    </span>
  )
}

const SearchSuggestions = () => {
  const { suggestions, debouncedQuery, executeSearch, isSearching } = useSearch()
  const navigate = useNavigate()

  const handleSelect = (term, route = null) => {
    executeSearch(term)
    if (route) {
      navigate(route)
    } else {
      navigate(`/search?q=${encodeURIComponent(term)}`)
    }
  }

  // Handle Loading State
  if (isSearching) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff6a00] mb-4"></div>
        <p className="text-sm font-medium">Searching MongoDB...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Column: Categories & Brands (Suggestions) */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col gap-6 bg-gray-50/50">
        
        {/* Categories */}
        {suggestions.categories.length > 0 && (
          <div>
            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h4>
            <div className="flex flex-col gap-1">
              {suggestions.categories.slice(0, 4).map((cat, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(cat, `/category/${cat.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-left group focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20"
                >
                  <FiGrid className="text-gray-400 group-hover:text-[#ff6a00]" />
                  <HighlightText text={cat} highlight={debouncedQuery} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {suggestions.brands.length > 0 && (
          <div>
            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Brands</h4>
            <div className="flex flex-col gap-1">
              {suggestions.brands.slice(0, 4).map((brand, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(brand)}
                  className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-left group focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20"
                >
                  <FiSearch className="text-gray-400 group-hover:text-[#ff6a00]" />
                  <HighlightText text={brand} highlight={debouncedQuery} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Products */}
      <div className="flex-[2] p-6 bg-white flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Products</h4>
          {suggestions.products.length > 0 && (
            <button 
              onClick={() => handleSelect(debouncedQuery)}
              className="text-[12px] font-bold text-[#ff6a00] flex items-center gap-1 hover:underline"
            >
              View all results <FiArrowRight />
            </button>
          )}
        </div>

        {suggestions.products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl mb-4">
              <FiPackage />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">No products found.</h3>
            <p className="text-[13px] text-gray-500">Please check your spelling or try another keyword.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {suggestions.products.map(product => {
              const brandName = typeof product.brand === 'object' && product.brand ? product.brand.name : product.brand;
              return (
              <button
                key={product._id || product.id}
                onClick={() => handleSelect(product.name, `/product/${product.slug}`)}
                className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors text-left group focus:outline-none"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg p-1 shrink-0 mix-blend-multiply overflow-hidden">
                  <img src={product.image || product.gallery?.[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[14px] font-bold text-gray-900 truncate group-hover:text-[#ff6a00] mb-0.5">
                    <HighlightText text={product.name} highlight={debouncedQuery} />
                  </h5>
                  {brandName && <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">{brandName}</div>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-black text-[#ff6a00]">Rs. {product.price?.toLocaleString()}</span>
                    {(product.oldPrice || product.comparePrice) && (
                      <span className="text-[11px] text-gray-400 line-through">Rs. {(product.oldPrice || product.comparePrice).toLocaleString()}</span>
                    )}
                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-0.5 ml-2">
                        <FiStar className="text-yellow-400 fill-current text-[10px]" />
                        <span className="text-[11px] font-bold text-gray-600">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {/* Stock */}
                    {product.stock > 0 ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-auto">In Stock</span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded ml-auto">Out of Stock</span>
                    )}
                  </div>
                </div>
              </button>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchSuggestions
