import { FiSearch } from 'react-icons/fi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useSearch } from '../../../context/SearchContext'

const SearchBar = () => {
  const { setIsOverlayOpen } = useSearch()

  return (
    <div className="flex-1 w-full max-w-[650px] mx-0 lg:mx-8">
      <div 
        onClick={() => setIsOverlayOpen(true)}
        className="flex h-11 w-full rounded-md border border-gray-300 bg-white overflow-hidden hover:border-[#ff6a00] hover:ring-1 hover:ring-[#ff6a00] transition-colors cursor-text group shadow-sm"
      >
        {/* Category Dropdown (Dummy button) */}
        <div className="flex items-center justify-between px-4 bg-gray-50 border-r border-gray-300 min-w-[140px] hover:bg-gray-100 transition-colors pointer-events-none">
          <span className="text-sm text-gray-700 font-medium">All Categories</span>
          <MdOutlineKeyboardArrowDown className="text-gray-500 text-lg" />
        </div>
        
        {/* Fake Search Input */}
        <div className="flex-1 flex items-center bg-transparent px-4">
          <span className="text-[14px] text-gray-400 group-hover:text-gray-500 transition-colors select-none">
            Search products, brands and categories...
          </span>
        </div>
        
        {/* Search Button */}
        <button
          type="button"
          className="w-[60px] flex items-center justify-center bg-[#ff6a00] hover:bg-[#e65c00] transition-colors pointer-events-none"
          aria-label="Submit search"
        >
          <FiSearch className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
}

export default SearchBar