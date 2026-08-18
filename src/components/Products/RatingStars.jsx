import { memo } from 'react'
import { FiStar } from 'react-icons/fi'

const RatingStars = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating)
  
  return (
    <div className="flex items-center gap-1 mt-2 mb-1">
      <div className="flex text-[#ffb800] text-[12px]">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            <FiStar className={i < fullStars ? 'fill-current' : ''} />
          </span>
        ))}
      </div>
      <span className="text-[11px] text-gray-500 ml-1">({reviews})</span>
    </div>
  )
}

export default memo(RatingStars)
