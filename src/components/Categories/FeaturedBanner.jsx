import { memo } from 'react'
import { Link } from 'react-router-dom'

const FeaturedBanner = ({ banner, categoryName }) => {
  if (!banner) {
    return (
      <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center justify-center text-center min-h-[200px]">
        <div className="text-orange-200 mb-2 font-medium">Exclusive Deals Preparing...</div>
        <div className="text-sm opacity-80">Our team is curating the best offers. Check back shortly.</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center text-center justify-center">
      <div className="text-[11px] font-bold text-[#ff6a00] tracking-wider uppercase mb-2">Special Offer</div>
      <div className="text-[16px] font-bold text-gray-900 mb-4">{banner.title}</div>
      <div className="w-full max-w-[180px] aspect-[4/3] relative mb-4 rounded-lg shadow-sm overflow-hidden bg-white">
        <img 
          src={banner.image} 
          alt={banner.title} 
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
        />
      </div>
      <Link 
        to={banner.link} 
        className="bg-gray-900 text-white text-[12px] font-bold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-full"
      >
        Explore Now
      </Link>
    </div>
  )
}

export default memo(FeaturedBanner)
