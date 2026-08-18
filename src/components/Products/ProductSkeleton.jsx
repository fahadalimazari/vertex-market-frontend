const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 rounded-xl mb-4 w-full"></div>
      
      {/* Info Skeleton */}
      <div className="flex flex-col flex-1 space-y-3">
        {/* Brand */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Rating */}
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        
        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="h-5 bg-gray-200 rounded w-2/5"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-4">
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
