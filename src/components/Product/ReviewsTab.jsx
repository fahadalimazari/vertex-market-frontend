import { memo } from 'react'
import { FiStar, FiCheckCircle } from 'react-icons/fi'

const ReviewsTab = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <div className="text-gray-500">No reviews yet.</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[16px] font-bold text-gray-500">
                {review.user.charAt(0)}
              </div>
              <div>
                <div className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                  {review.user}
                  {review.verified && (
                    <FiCheckCircle className="text-[#ff6a00] text-[12px]" title="Verified Purchase" />
                  )}
                </div>
                <div className="flex text-[#ffb800] text-[12px] mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      <FiStar className={i < review.rating ? 'fill-current' : ''} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-[12px] text-gray-400">{review.date}</div>
          </div>
          <p className="text-[14px] text-gray-700 mt-3">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

export default memo(ReviewsTab)
