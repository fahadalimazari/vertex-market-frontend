import { memo } from 'react'
import { FiCheckCircle, FiLock, FiTruck, FiRefreshCcw } from 'react-icons/fi'

const TrustBadges = () => {
  const badges = [
    { icon: FiCheckCircle, text: "100% Genuine Products" },
    { icon: FiLock, text: "Secure Payment" },
    { icon: FiTruck, text: "Fast Delivery" },
    { icon: FiRefreshCcw, text: "7-Day Return" }
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-100 my-8 bg-gray-50/50 px-4 rounded-xl">
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div key={index} className="flex items-center gap-2">
            <Icon className="text-xl text-[#ff6a00]" />
            <span className="text-[12px] font-semibold text-gray-700">{badge.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default memo(TrustBadges)
