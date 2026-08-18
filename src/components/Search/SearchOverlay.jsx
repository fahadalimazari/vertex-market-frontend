import { FiSearch, FiMic, FiCamera, FiX, FiClock, FiTrendingUp } from 'react-icons/fi'
import { useSearch } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import SearchSuggestions from './SearchSuggestions'
import RecentSearches from './RecentSearches'
import VoiceSearchModal from '../AI/VoiceSearchModal'
import ImageSearchModal from '../AI/ImageSearchModal'
import { popularCategories, trendingSearches, popularBrands } from '../../data/searchData'

const SearchOverlay = () => {
  const { isOverlayOpen, setIsOverlayOpen, query, setQuery, debouncedQuery, executeSearch } = useSearch()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  
  const [showVoice, setShowVoice] = useState(false)
  const [showImage, setShowImage] = useState(false)

  // Focus on open & block scroll
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden'
      // Small timeout ensures the transition starts before focusing
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOverlayOpen])

  // Keyboard navigation for closing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOverlayOpen) {
        setIsOverlayOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOverlayOpen, setIsOverlayOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      executeSearch(query)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  if (!isOverlayOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOverlayOpen(false)}
        aria-hidden="true"
      />

      {/* Main Overlay */}
      <div 
        className="fixed inset-0 md:inset-x-0 md:top-20 z-[101] flex flex-col items-center pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="w-full h-full md:h-auto md:w-[750px] bg-gray-50 md:rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header & Input */}
          <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <form onSubmit={handleSubmit} className="flex-1 relative flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#ff6a00] focus-within:bg-white transition-all h-12 shadow-sm">
              <div className="pl-4 text-gray-400">
                <FiSearch className="text-lg" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, brands..."
                className="flex-1 h-full bg-transparent border-none outline-none px-3 text-[16px] text-gray-900 placeholder:text-gray-400"
              />
              <div className="flex items-center gap-1 pr-2 border-l border-gray-200 pl-2">
                <button type="button" onClick={() => setShowImage(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors" aria-label="Visual Search">
                  <FiCamera />
                </button>
                <button type="button" onClick={() => setShowVoice(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ff6a00] hover:bg-orange-50 focus:outline-none transition-colors" aria-label="Voice Search">
                  <FiMic />
                </button>
              </div>
            </form>
            <button 
              onClick={() => setIsOverlayOpen(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 focus:outline-none shrink-0 transition-colors md:hidden"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
            {debouncedQuery.trim() ? (
              <SearchSuggestions />
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="flex flex-col gap-6">
                    <RecentSearches />
                    
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <FiTrendingUp /> Trending Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              executeSearch(term)
                              navigate(`/search?q=${encodeURIComponent(term)}`)
                            }}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-[13px] hover:border-[#ff6a00] hover:text-[#ff6a00] hover:bg-orange-50 transition-colors focus:outline-none"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-6 border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-6">
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Popular Categories
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {popularCategories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setIsOverlayOpen(false)
                              navigate(`/category/${cat.slug}`)
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left focus:outline-none group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#ff6a00] group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all">
                              <FiSearch /> {/* Placeholder icon */}
                            </div>
                            <span className="text-[13px] font-bold text-gray-700 group-hover:text-gray-900">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Popular Brands
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {popularBrands.map((brand, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              executeSearch(brand)
                              navigate(`/search?q=${encodeURIComponent(brand)}`)
                            }}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[13px] font-bold hover:border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <VoiceSearchModal isOpen={showVoice} onClose={() => setShowVoice(false)} />
      <ImageSearchModal isOpen={showImage} onClose={() => setShowImage(false)} />
    </>
  )
}

export default SearchOverlay
