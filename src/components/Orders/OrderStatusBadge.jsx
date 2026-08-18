import { memo } from 'react';

const OrderStatusBadge = memo(({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
      case 'Confirmed':
      case 'Processing':
      case 'Packed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
      case 'Out For Delivery':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Return Requested':
      case 'Exchange Requested':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Returned':
      case 'Refund Processing':
      case 'Refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
});

OrderStatusBadge.displayName = 'OrderStatusBadge';
export default OrderStatusBadge;
