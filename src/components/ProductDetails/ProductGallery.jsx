import { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { FiZoomIn, FiChevronLeft, FiChevronRight, FiPlay, FiRefreshCw, FiX } from 'react-icons/fi';

const ProductGallery = ({ gallery, fallbackImage }) => {
  const { activeImageIndex, setActiveImageIndex } = useProduct();
  const [showLightbox, setShowLightbox] = useState(false);
  
  // Hover Zoom state
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  const activeUrl = gallery[activeImageIndex] || fallbackImage;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeUrl})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handlePrev = () => {
    setActiveImageIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex(prev => (prev + 1) % gallery.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-square bg-white border border-gray-100 rounded-3xl overflow-hidden group">
        
        <div 
          className="w-full h-full relative cursor-zoom-in flex items-center justify-center p-6"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setShowLightbox(true)}
        >
          <img 
            src={activeUrl} 
            alt="Active product view" 
            className="w-full h-full object-contain mix-blend-multiply" 
          />
          {/* Desktop Zoom Overlay */}
          <div 
            style={zoomStyle}
            className="absolute inset-0 pointer-events-none hidden md:block rounded-3xl bg-no-repeat bg-white"
          />
        </div>

        {/* Zoom Trigger Button */}
        <button 
          onClick={() => setShowLightbox(true)}
          className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2.5 rounded-full shadow-md text-gray-700 hover:text-[#ff6a00]"
        >
          <FiZoomIn className="h-4.5 w-4.5" />
        </button>

        {/* Carousel buttons */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-md text-gray-700 hover:text-[#ff6a00]"
            >
              <FiChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-md text-gray-700 hover:text-[#ff6a00]"
            >
              <FiChevronRight className="h-4.5 w-4.5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <span className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {activeImageIndex + 1} / {gallery.length || 1}
        </span>
      </div>

      {/* Thumbnails list */}
      <div className="flex gap-3 overflow-x-auto pb-1 select-none">
        {gallery.map((mediaUrl, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`h-16 w-16 border rounded-xl p-1 flex items-center justify-center bg-white flex-shrink-0 relative overflow-hidden transition-all ${
              activeImageIndex === idx 
                ? 'border-[#ff6a00] ring-1 ring-[#ff6a00]' 
                : 'border-gray-150 hover:border-gray-300'
            }`}
          >
            <img src={mediaUrl} alt="Thumbnail view" className="max-h-full max-w-full object-contain rounded-lg mix-blend-multiply" />
          </button>
        ))}

        {/* 360 View Placeholder */}
        <button
          onClick={() => {
            setActiveImageIndex(0);
            toast.success('Loading 360° Interactive Product view...');
          }}
          className="h-16 w-16 border border-dashed border-gray-350 hover:border-[#ff6a00] rounded-xl flex flex-col items-center justify-center bg-gray-50 flex-shrink-0 text-gray-500 hover:text-[#ff6a00] transition-colors"
        >
          <FiRefreshCw className="h-5 w-5 animate-spin-slow" />
          <span className="text-[8px] font-bold uppercase tracking-wider mt-1">360° View</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6">
          <button 
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 text-white hover:text-[#ff6a00] p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
          >
            <FiX className="h-6 w-6" />
          </button>

          <div className="relative max-w-4xl w-full aspect-square flex items-center justify-center">
            <img 
              src={activeUrl} 
              alt="Fullscreen product view" 
              className="max-h-[85vh] max-w-full object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
