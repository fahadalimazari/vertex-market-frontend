import { memo } from 'react';

const ReviewsSkeleton = memo(() => {
  return (
    <div className="space-y-6">
      {/* Summary Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 animate-pulse">
        <div className="w-[200px] flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8">
          <div className="w-24 h-16 bg-gray-200 rounded-xl mb-2" />
          <div className="w-32 h-4 bg-gray-200 rounded-full mb-4" />
          <div className="w-full h-8 bg-gray-200 rounded-xl" />
        </div>
        <div className="flex-1 space-y-4 py-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-4 bg-gray-200 rounded-full" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full" />
              <div className="w-8 h-4 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
                <div className="w-1/3 h-3 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="w-3/4 h-5 bg-gray-200 rounded-full mb-3" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded-full" />
              <div className="w-full h-3 bg-gray-200 rounded-full" />
              <div className="w-2/3 h-3 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ReviewsSkeleton.displayName = 'ReviewsSkeleton';
export default ReviewsSkeleton;
