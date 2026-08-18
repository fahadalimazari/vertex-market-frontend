import { memo } from 'react';

const EmptyOrders = memo(({ message = "You haven't placed any orders yet." }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
      <p className="text-gray-500 text-sm max-w-sm">{message}</p>
    </div>
  );
});

EmptyOrders.displayName = 'EmptyOrders';
export default EmptyOrders;
