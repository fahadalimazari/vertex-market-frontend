import { FiCpu, FiMic, FiBarChart2, FiStar } from 'react-icons/fi'

const BottomFeatures = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-4 p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
        <div className="flex items-center gap-4 lg:pr-6 lg:border-r lg:border-gray-100 last:border-0">
          <FiCpu className="text-3xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-gray-900 leading-tight truncate">AI Shopping Assistant</div>
            <div className="text-[12px] text-gray-500 mt-0.5 truncate">Get smart product suggestions</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:px-6 lg:border-r lg:border-gray-100 last:border-0">
          <FiMic className="text-3xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-gray-900 leading-tight truncate">Voice Search</div>
            <div className="text-[12px] text-gray-500 mt-0.5 truncate">Search with your voice</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:px-6 lg:border-r lg:border-gray-100 last:border-0">
          <FiBarChart2 className="text-3xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-gray-900 leading-tight truncate">AI Product Compare</div>
            <div className="text-[12px] text-gray-500 mt-0.5 truncate">Compare & choose better</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:pl-6">
          <FiStar className="text-3xl text-gray-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-gray-900 leading-tight truncate">AI Review Summary</div>
            <div className="text-[12px] text-gray-500 mt-0.5 truncate">Get summary of reviews</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomFeatures
