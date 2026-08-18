import { memo } from 'react';
import { FiRefreshCw, FiClock, FiCheckCircle } from 'react-icons/fi';

const RefundCard = memo(({ refund }) => {
  const getStatusIcon = () => {
    switch(refund.status) {
      case 'Refunded': return <FiCheckCircle className="text-green-500" />;
      case 'Refund Processing': return <FiRefreshCw className="text-orange-500 animate-spin-slow" />;
      default: return <FiClock className="text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    if (refund.status === 'Refunded') return 'bg-green-100 text-green-800';
    if (refund.status === 'Refund Processing') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-xl">
          {getStatusIcon()}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            {refund.id}
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusBadge()}`}>
              {refund.status}
            </span>
          </h4>
          <p className="text-xs text-gray-500 mt-1">Order: {refund.orderId} • {new Date(refund.requestDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-black text-gray-900">Rs. {refund.amount.toLocaleString()}</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">via {refund.method}</p>
      </div>
    </div>
  );
});

RefundCard.displayName = 'RefundCard';
export default RefundCard;
