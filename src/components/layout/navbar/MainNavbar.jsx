import { useState } from 'react'
import { FiMenu, FiSearch } from 'react-icons/fi'
import Logo from './Logo'
import SearchBar from './SearchBar'
import NavIcons from './NavIcons'

const MainNavbar = ({ onMobileMenuOpen }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="mx-auto flex h-[70px] sm:h-[84px] max-w-[1440px] items-center justify-between px-3 sm:px-4 lg:px-8">
        {/* Left: Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          
          <Logo />
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden flex-1 lg:flex justify-center">
          <SearchBar />
        </div>

        {/* Right: Navigation Icons */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors lg:hidden shrink-0"
            aria-label="Search"
          >
            <FiSearch className="h-5 w-5" />
          </button>
          
          <NavIcons />
        </div>
      </div>
      
      {/* Mobile Search Bar Row */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50">
          <SearchBar />
        </div>
      )}
    </div>
  )
}

export default MainNavbar