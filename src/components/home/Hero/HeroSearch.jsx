import { FiSearch } from 'react-icons/fi'
import { useState } from 'react'

const HeroSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Implement search functionality
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <label htmlFor="hero-search" className="sr-only">
          Search products, brands and categories
        </label>
        <div className="flex h-[52px] items-center rounded-[14px] border border-[#E5E7EB] bg-white pl-5 pr-1 shadow-sm focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] transition-all">
          <FiSearch className="h-5 w-5 text-[#6B7280]" />
          
          <input
            id="hero-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands and categories..."
            className="w-full border-none bg-transparent px-4 text-[15px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            aria-label="Search products"
          />
          
          <button
            type="submit"
            className="h-[44px] rounded-[10px] bg-[#2563EB] px-6 text-[15px] font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
            aria-label="Submit search"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  )
}

export default HeroSearch