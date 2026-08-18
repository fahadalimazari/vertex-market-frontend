import { memo } from 'react'

const ImageViewer = ({ images, currentIndex }) => {
  const currentImage = images[currentIndex]

  return (
    <div className="relative aspect-square w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group">
      {/* Main Image */}
      <img 
        src={currentImage} 
        alt={`Product view ${currentIndex + 1}`}
        loading="lazy"
        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
      />
      
      {/* Image Counter */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[12px] font-bold text-gray-700 shadow-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export default memo(ImageViewer)
