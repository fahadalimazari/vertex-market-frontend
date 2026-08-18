import { memo } from 'react'
import { FiEye } from 'react-icons/fi'

const QuickViewButton = ({ productId }) => {
  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Future: dispatch(openQuickViewModal(productId))
    console.log(`Quick view for product ${productId}`)
  }

  return (
    <button
      onClick={handleQuickView}
      className="w-full bg-white text-gray-800 border border-gray-200 py-2 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
      aria-label="Quick view product"
    >
      <FiEye className="text-lg text-gray-500" />
      Quick View
    </button>
  )
}

export default memo(QuickViewButton)
