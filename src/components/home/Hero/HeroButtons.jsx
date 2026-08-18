import { Link } from 'react-router-dom'

const HeroButtons = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Link
        to="/products"
        className="h-[52px] rounded-[12px] bg-[#2563EB] px-8 text-[15px] font-semibold text-white hover:bg-[#1D4ED8] transition-colors duration-200 flex items-center justify-center shadow-sm"
        aria-label="Shop Now"
      >
        Shop Now
      </Link>
      <Link
        to="/deals"
        className="h-[52px] rounded-[12px] border-2 border-[#2563EB] bg-white px-8 text-[15px] font-semibold text-[#2563EB] hover:bg-[#F8FAFF] transition-colors duration-200 flex items-center justify-center"
        aria-label="Explore Deals"
      >
        Explore Deals
      </Link>
    </div>
  )
}

export default HeroButtons