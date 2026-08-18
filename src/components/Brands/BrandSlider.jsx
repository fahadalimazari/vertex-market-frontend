import { useEffect, useState } from 'react';
import { useBrands } from '../../hooks/useBrands';
import BrandCard from './BrandCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const BrandSlider = () => {
  const { data: brands, loading } = useBrands();
  const [startIndex, setStartIndex] = useState(0);

  // Filter only featured brands
  const featured = brands.filter(b => b.featured);

  useEffect(() => {
    if (featured.length <= 3) return;
    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 1) % (featured.length - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const handlePrev = () => {
    setStartIndex(prev => (prev === 0 ? featured.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % (featured.length - 2));
  };

  if (loading || featured.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-44 bg-gray-50 border border-gray-150 rounded-3xl" />
        ))}
      </div>
    );
  }

  // Slice visible items (show up to 3 cards at a time)
  const visibleBrands = featured.slice(startIndex, startIndex + 3);

  return (
    <div className="relative group">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {visibleBrands.map(brand => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {featured.length > 3 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white border border-gray-100 p-2.5 rounded-full shadow-md text-gray-700 hover:text-[#ff6a00] hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-white border border-gray-100 p-2.5 rounded-full shadow-md text-gray-700 hover:text-[#ff6a00] hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default BrandSlider;
