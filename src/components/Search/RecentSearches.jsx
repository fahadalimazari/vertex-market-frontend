import { FiClock, FiX } from 'react-icons/fi'
import { useSearch } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'

const RecentSearches = () => {
  const { recentSearches, removeRecentSearch, clearRecentSearches, executeSearch } = useSearch()
  const navigate = useNavigate()

  if (recentSearches.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <FiClock /> Recent Searches
        </h4>
        <button 
          onClick={clearRecentSearches}
          className="text-[11px] font-bold text-[#ff6a00] hover:underline focus:outline-none"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-col gap-1">
        {recentSearches.slice(0, 5).map((term, i) => (
          <div key={i} className="group flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <button
              onClick={() => {
                executeSearch(term)
                navigate(`/search?q=${encodeURIComponent(term)}`)
              }}
              className="flex-1 flex items-center gap-3 text-left focus:outline-none"
            >
              <FiClock className="text-gray-400 shrink-0" />
              <span className="text-[14px] text-gray-700 font-medium group-hover:text-[#ff6a00] truncate">{term}</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                removeRecentSearch(term)
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:outline-none shrink-0"
              aria-label="Remove search"
            >
              <FiX className="text-[14px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentSearches
