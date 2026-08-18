import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/Orders/OrderCard';
import EmptyOrders from '../../components/Orders/EmptyOrders';
import OrderSkeleton from '../../components/Orders/OrderSkeleton';
import { FiFilter } from 'react-icons/fi';

const Orders = () => {
  const { orders, isLoading } = useOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your recent purchases.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm">
          <FiFilter /> Filter
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <EmptyOrders />
        )}
      </div>
    </div>
  );
};

export default Orders;
