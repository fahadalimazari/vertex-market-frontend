import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiPackage, FiHeart, FiBell, FiSettings, FiMessageSquare } from 'react-icons/fi'
import { useDashboard } from '../../context/Dashboard/DashboardContext'
import { useAI } from '../../context/AIContext'
import { products } from '../../data/products'

const GlobalSearch = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { orders, wishlist, notifications } = useDashboard()
  const { setIsOpen: setAIOpen } = useAI()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 0)
  }

  const getResults = () => {
    if (!query) return []
    const lowerQuery = query.toLowerCase()
    
    const orderResults = orders
      .filter(o => o.id.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .map(o => ({ type: 'Order', title: `Order ${o.id}`, link: `/account/orders/${o.id}`, icon: FiPackage }))
      
    const wishlistResults = wishlist
      .filter(w => w.name.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .map(w => ({ type: 'Wishlist', title: w.name, link: `/product/${w.slug}`, icon: FiHeart }))
      
    const notifResults = notifications
      .filter(n => n.title.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .map(n => ({ type: 'Notification', title: n.title, link: '/account/notifications', icon: FiBell }))
      
    const productResults = products
      .filter(p => p.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map(p => ({ type: 'Product', title: p.name, link: `/product/${p.slug}`, icon: FiSearch }))

    return [...orderResults, ...wishlistResults, ...notifResults, ...productResults]
  }

  const results = getResults()

  const handleSelect = (link) => {
    setIsOpen(false)
    setQuery('')
    navigate(link)
  }

  const handleAskAI = () => {
    setIsOpen(false)
    setQuery('')
    setAIOpen(true)
    // We could pre-fill the input or automatically send the message here
    // but opening it is sufficient for the demo
  }

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 text-lg" />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={handleSearch}
        onFocus={() => query.length > 0 && setIsOpen(true)}
        className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100 border-transparent focus:bg-white rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all shadow-sm"
        placeholder="Search orders, wishlist, products..."
      />

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up max-h-96 overflow-y-auto">
            <div className="p-2 flex flex-col gap-1">
              {results.length > 0 ? (
                results.map((result, index) => {
                  const Icon = result.icon
                  return (
                    <button 
                      key={index}
                      onClick={() => handleSelect(result.link)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none text-left w-full"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                        <Icon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 truncate">{result.title}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{result.type}</p>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center">
                  <FiSearch className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-[14px] font-bold text-gray-900">No results found for "{query}"</p>
                </div>
              )}
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button 
                  onClick={handleAskAI}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors focus:outline-none text-left w-full group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ff6a00] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <FiMessageSquare />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-gray-900 truncate group-hover:text-[#ff6a00] transition-colors">Ask AI about "{query}"</p>
                    <p className="text-[11px] font-bold text-[#ff6a00] opacity-80 uppercase tracking-wider">AI Shopping Assistant</p>
                  </div>
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
