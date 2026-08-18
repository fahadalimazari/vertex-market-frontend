import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const SectionHeader = ({ title, description, viewAllLink }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-[22px] md:text-[24px] font-bold text-gray-900 leading-tight mb-1">
          {title}
        </h2>
        {description && (
          <p className="text-[14px] text-gray-500">
            {description}
          </p>
        )}
      </div>
      
      {viewAllLink && (
        <Link 
          to={viewAllLink}
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#ff6a00] hover:text-[#e65c00] transition-colors group focus:outline-none focus:underline"
        >
          View All
          <FiArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  )
}

export default memo(SectionHeader)
