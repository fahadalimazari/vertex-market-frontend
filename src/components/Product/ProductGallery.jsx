import { memo, useState } from 'react'
import ImageViewer from './ImageViewer'
import ThumbnailList from './ThumbnailList'
import { FiPlayCircle, FiBox } from 'react-icons/fi'

const ProductGallery = ({ images = [], videoPlaceholder, view360Placeholder }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-lg">No Images Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ImageViewer images={images} currentIndex={currentIndex} />
        
        {/* Placeholder Badges for Future Media */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {videoPlaceholder && (
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-white transition-colors">
              <FiPlayCircle className="text-[#ff6a00]" />
              Video
            </div>
          )}
          {view360Placeholder && (
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-white transition-colors">
              <FiBox className="text-[#ff6a00]" />
              360° View
            </div>
          )}
        </div>
      </div>
      <ThumbnailList 
        images={images} 
        currentIndex={currentIndex} 
        onSelect={setCurrentIndex} 
      />
    </div>
  )
}

export default memo(ProductGallery)
