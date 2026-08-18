import { memo } from 'react';

const OrderSkeleton = memo(() => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 w-full animate-pulse">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-32"></div>
          <div className="h-3 bg-gray-100 rounded-md w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );
});

OrderSkeleton.displayName = 'OrderSkeleton';
export default OrderSkeleton;
