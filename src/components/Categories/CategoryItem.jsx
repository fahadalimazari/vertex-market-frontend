import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'react-icons/fi'

const CategoryItem = ({ 
  category, 
  isActive, 
  onMouseEnter, 
  onClick 
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const Icon = Icons[category.icon] || Icons.FiBox
  
  const hasSubCategories = category.subCategories && category.subCategories.length > 0
  const hasMegaMenu = 
    hasSubCategories ||
    (category.brands && category.brands.length > 0) ||
    (category.featuredProducts && category.featuredProducts.length > 0) ||
    !!category.banner

  const handleMobileToggle = (e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault() // Prevent navigation if we want accordion behavior
      setIsAccordionOpen(!isAccordionOpen)
      onClick(category.slug)
    }
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      className="group relative outline-none"
      role="menuitem"
      aria-haspopup={hasMegaMenu ? "true" : "false"}
      aria-expanded={isActive}
    >
      <Link 
        to={`/categories/${category.slug}`}
        onClick={handleMobileToggle}
        className={`flex items-center justify-between px-5 py-2.5 transition-colors focus:bg-orange-50 focus:outline-none ${
          isActive 
            ? 'bg-gray-50 text-[#ff6a00]' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-[#ff6a00]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`text-lg transition-colors ${
            isActive ? 'text-[#ff6a00]' : 'text-gray-400 group-hover:text-[#ff6a00]'
          }`} />
          <span className="text-[13px] font-medium">{category.name}</span>
        </div>
        
        {hasMegaMenu && (
          <Icons.FiChevronRight className={`transition-transform ${
            isActive ? 'text-[#ff6a00]' : 'text-gray-400 group-hover:text-[#ff6a00]'
          } ${isAccordionOpen ? 'rotate-90' : ''}`} />
        )}
      </Link>

      {/* Mobile Accordion Content (Hidden on Desktop) */}
      {hasSubCategories && (
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isAccordionOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="bg-gray-50 py-2 pl-12 pr-4 space-y-2 border-b border-gray-100">
            {category.subCategories.map((sub) => (
              <li key={sub.id}>
                <Link 
                  to={`/categories/${category.slug}/${sub.slug}`}
                  className="text-[12px] text-gray-600 hover:text-[#ff6a00] block py-1"
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default memo(CategoryItem)
