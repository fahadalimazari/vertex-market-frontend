import { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrandList from './BrandList'
import FeaturedProducts from './FeaturedProducts'
import FeaturedBanner from './FeaturedBanner'

const MegaMenu = ({ category, onClose }) => {
  // ESC key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!category) return null

  const hasSubCategories = category.subCategories && category.subCategories.length > 0
  const hasBrands = category.brands && category.brands.length > 0
  const hasProducts = category.featuredProducts && category.featuredProducts.length > 0
  const hasBanner = !!category.banner

  if (!hasSubCategories && !hasBrands && !hasProducts && !hasBanner) {
    return null // Do not render if completely empty
  }

  return (
    <div 
      className="absolute top-0 left-full ml-1 w-[800px] min-h-[480px] h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex gap-8 z-50 cursor-default"
      role="menu"
      aria-label={`${category.name} mega menu`}
    >
      {/* Column 1: Sub Categories */}
      <div className="flex-[1.2]">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
          {category.name}
        </h3>
        
        {hasSubCategories ? (
          <ul className="space-y-3" role="group">
            {category.subCategories.map((sub) => (
              <li key={sub.id} role="menuitem">
                <Link 
                  to={`/categories/${category.slug}/${sub.slug}`}
                  className="text-[13px] text-gray-600 hover:text-[#ff6a00] hover:underline transition-all block"
                  onClick={onClose}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Select a department to view subcategories
          </div>
        )}
      </div>

      {/* Column 2: Popular Brands */}
      <BrandList brands={category.brands} categorySlug={category.slug} />

      {/* Column 3: Featured Products */}
      <FeaturedProducts products={category.featuredProducts} />

      {/* Column 4: Promotional Banner */}
      <FeaturedBanner banner={category.banner} categoryName={category.name} />
    </div>
  )
}

export default memo(MegaMenu)
