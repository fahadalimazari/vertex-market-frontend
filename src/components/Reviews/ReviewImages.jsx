import { memo, useState } from 'react';
import { FiPlay, FiX } from 'react-icons/fi';

const ReviewImages = memo(({ images = [], video = null }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!images.length && !video) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        {video && (
          <div 
            className="w-20 h-20 rounded-xl overflow-hidden relative cursor-pointer group bg-black"
            onClick={() => setFullscreenImage(video)}
          >
            <img src={video.thumbnail || 'https://via.placeholder.com/150'} alt="Video thumbnail" className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                <FiPlay size={14} className="ml-1" />
              </div>
            </div>
          </div>
        )}
        
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-[#ff6a00] transition-colors"
            onClick={() => setFullscreenImage(img)}
          >
            <img src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button 
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>
          
          <div className="max-w-5xl w-full max-h-[80vh] flex items-center justify-center">
             <img src={typeof fullscreenImage === 'string' ? fullscreenImage : fullscreenImage.url} alt="Fullscreen Review" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        </div>
      )}
    </>
  );
});

ReviewImages.displayName = 'ReviewImages';
export default ReviewImages;
