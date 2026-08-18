import { memo } from 'react'

const ThumbnailList = ({ images, currentIndex, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x py-1">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`relative aspect-square w-[80px] flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] ${
            currentIndex === index 
              ? 'border-[#ff6a00]' 
              : 'border-transparent hover:border-gray-200 bg-gray-50'
          }`}
          aria-label={`Select image ${index + 1}`}
          aria-current={currentIndex === index}
        >
          <img 
            src={img} 
            alt={`Thumbnail ${index + 1}`} 
            loading="lazy"
            className="w-full h-full object-contain p-2"
          />
        </button>
      ))}
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}

export default memo(ThumbnailList)
