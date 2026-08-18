import { useState, useEffect } from 'react';
import { FiImage } from 'react-icons/fi';

const OptimizedImage = ({ src, alt, className = '', containerClassName = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${containerClassName || className}`}>
        <FiImage className="text-2xl opacity-50" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName || className}`}>
      {/* Blur Placeholder / Skeleton */}
      <div 
        className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};

export default OptimizedImage;
