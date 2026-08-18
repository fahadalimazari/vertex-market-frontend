import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiMenu, FiChevronRight } from 'react-icons/fi'
import { categories as staticCategories } from '../../data/categories'
import CategoryItem from './CategoryItem'
import MegaMenu from './MegaMenu'

const Sidebar = () => {
  const { slug } = useParams()
  
  const [categories, setCategories] = useState(staticCategories)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/categories/active')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(err => console.error('Error fetching dynamic mega menu categories:', err));
  }, [])

  // Separate states for granular control as requested
  const [hoverCategory, setHoverCategory] = useState(null)
  const [clickCategory, setClickCategory] = useState(null)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const listRef = useRef(null)

  // Derived state for the currently active category object
  const activeCategoryData = useMemo(() => {
    const targetSlug = hoverCategory || clickCategory || slug
    return categories.find(c => c.slug === targetSlug) || null
  }, [categories, hoverCategory, clickCategory, slug])

  // Active categories list (filtered by isActive if backend supports soft deletes)
  const activeCategories = useMemo(() => categories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [categories])

  const handleMouseEnter = useCallback((categorySlug) => {
    if (window.innerWidth > 1024) {
      setHoverCategory(categorySlug)
      setIsMegaMenuOpen(true)
      setFocusedIndex(activeCategories.findIndex(c => c.slug === categorySlug))
    }
  }, [activeCategories])

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth > 1024) {
      setHoverCategory(null)
      setIsMegaMenuOpen(false)
      setFocusedIndex(-1)
    }
  }, [])

  const handleClick = useCallback((categorySlug) => {
    if (window.innerWidth <= 1024) {
      if (clickCategory === categorySlug) {
        // Toggle off if clicking same category
        setIsMegaMenuOpen(false)
        setClickCategory(null)
      } else {
        setClickCategory(categorySlug)
        // Mega Menu doesn't open on mobile inside Sidebar (we use accordion), only on tablet
        if (window.innerWidth > 768) {
          setIsMegaMenuOpen(true)
        }
      }
    }
  }, [clickCategory])

  // Reset hover/click state on route change
  useEffect(() => {
    setHoverCategory(null)
    setClickCategory(null)
    setIsMegaMenuOpen(false)
  }, [slug])

  // Keyboard accessibility (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!listRef.current || !listRef.current.contains(document.activeElement)) return
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(prev => (prev < activeCategories.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0))
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeCategories.length])

  // Auto focus the DOM element when keyboard navigating
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="menuitem"]')
      if (items[focusedIndex]) {
        items[focusedIndex].querySelector('a')?.focus()
      }
    }
  }, [focusedIndex])

  const getIsActive = (categorySlug) => {
    if (hoverCategory) return categorySlug === hoverCategory
    if (clickCategory) return categorySlug === clickCategory
    return categorySlug === slug
  }

  return (
    <div 
      className="relative z-40 w-full lg:w-[260px] flex-shrink-0"
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-auto lg:h-[480px]">
        {/* Header (acts as toggle on mobile) */}
        <div 
          className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 font-bold text-gray-900 text-[15px] rounded-t-2xl cursor-pointer lg:cursor-default"
          onClick={() => window.innerWidth <= 1024 && setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          role="button"
          aria-expanded={isMobileSidebarOpen}
        >
          <FiMenu className="text-xl" />
          Categories
        </div>
        
        {/* Scrollable Categories List */}
        <div 
          ref={listRef}
          className={`lg:overflow-y-auto flex-1 custom-scrollbar py-2 ${
            window.innerWidth <= 1024 && !isMobileSidebarOpen ? 'hidden' : 'block'
          } lg:block`}
          role="menu"
        >
          {activeCategories.map((category, index) => (
            <CategoryItem 
              key={category.id}
              category={category}
              isActive={getIsActive(category.slug)}
              onMouseEnter={() => handleMouseEnter(category.slug)}
              onClick={() => handleClick(category.slug)}
            />
          ))}
          
          <Link 
            to="/categories"
            className="flex items-center justify-between px-5 py-3 mt-1 border-t border-gray-100 hover:bg-gray-50 text-[#ff6a00] transition-colors group focus:outline-none focus:bg-orange-50"
            role="menuitem"
          >
            <span className="text-[13px] font-semibold">View All Categories</span>
            <FiChevronRight className="text-lg" />
          </Link>
        </div>
      </div>

      {/* Mega Menu Portal / Overlay (Hidden on Mobile, shown on Tablet/Desktop) */}
      {isMegaMenuOpen && activeCategoryData && (
        <div className="hidden md:block">
          <MegaMenu 
            category={activeCategoryData} 
            onClose={() => {
              setIsMegaMenuOpen(false)
              setClickCategory(null)
              setHoverCategory(null)
            }}
          />
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }
      `}} />
    </div>
  )
}

export default Sidebar
