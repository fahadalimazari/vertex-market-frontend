import { FiGrid } from 'react-icons/fi'

const CategoriesButton = () => {
  return (
    <button
      type="button"
      className="flex h-[44px] items-center gap-2 rounded-[10px] bg-[#2563EB] px-4 text-[14px] font-medium text-white hover:bg-[#1D4ED8] transition-colors"
      aria-label="Browse all categories"
    >
      <FiGrid className="h-5 w-5" />
      <span className="hidden lg:inline">All Categories</span>
    </button>
  )
}

export default CategoriesButton