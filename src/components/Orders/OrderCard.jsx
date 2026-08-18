import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import OrderStatusBadge from './OrderStatusBadge';

const OrderCard = memo(({ order }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiPackage className="text-gray-400" />
            <span className="font-bold text-gray-900 text-sm">{order.id}</span>
          </div>
          <p className="text-xs text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col items-end">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-gray-500 mt-1.5 font-bold">Total: Rs. {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden p-1">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-gray-500 font-medium">+{order.items.length - 2} more items</p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex gap-3">
        <Link
          to={`/account/orders/${order.id}`}
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
        >
          Manage Order
        </Link>
        <Link
          to={`/track-order?id=${order.id}`}
          className="flex-1 bg-[#ff6a00]/10 hover:bg-[#ff6a00]/20 text-[#ff6a00] py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
        >
          Track Shipment <FiChevronRight />
        </Link>
      </div>
    </div>
  );
});

OrderCard.displayName = 'OrderCard';
export default OrderCard;
