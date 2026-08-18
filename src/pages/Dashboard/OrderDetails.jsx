import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import OrderStatusBadge from '../../components/Orders/OrderStatusBadge';
import TrackingSteps from '../../components/Orders/TrackingSteps';
import OrderInvoice from '../../components/Orders/OrderInvoice';
import CancelOrderModal from '../../components/Orders/CancelOrderModal';
import ReturnRequestModal from '../../components/Orders/ReturnRequestModal';
import { FiArrowLeft, FiClock, FiMapPin, FiTruck, FiAlertCircle } from 'react-icons/fi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, trackOrder, activeTracking, cancelOrder, requestReturn } = useOrders();
  
  const [order, setOrder] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const o = getOrderById(orderId);
    if (o) {
      setOrder(o);
      trackOrder(orderId);
    } else {
      navigate('/account/orders');
    }
  }, [orderId, getOrderById, trackOrder, navigate]);

  if (!order) {
    return <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
      <div className="h-64 bg-gray-100 rounded-2xl w-full"></div>
    </div>;
  }

  const handleCancelOrder = async () => {
    setIsProcessing(true);
    const success = await cancelOrder(order.id);
    setIsProcessing(false);
    if (success) {
      setIsCancelModalOpen(false);
      setOrder(getOrderById(order.id));
    }
  };

  const handleReturnRequest = async ({ reason, notes }) => {
    setIsProcessing(true);
    const success = await requestReturn(order.id, order.items[0].productId, reason, notes);
    setIsProcessing(false);
    if (success) {
      setIsReturnModalOpen(false);
      setOrder(getOrderById(order.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/account/orders')} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-100 rounded-xl transition-colors shadow-sm">
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-gray-900">{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-500 font-medium">Placed on {new Date(order.date).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tracking & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Timeline Widget */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiTruck className="text-[#ff6a00]" /> Shipment Tracking
            </h3>
            {activeTracking ? (
              <TrackingSteps timeline={activeTracking} />
            ) : (
              <p className="text-xs text-gray-500">Tracking information is currently unavailable.</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-[#ff6a00]" /> Order Actions
            </h3>
            
            {['Pending', 'Confirmed', 'Processing', 'Packed'].includes(order.status) && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors text-center block"
              >
                Cancel Order
              </button>
            )}

            {order.status === 'Delivered' && (
              <button
                onClick={() => setIsReturnModalOpen(true)}
                className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-colors text-center block"
              >
                Request Return
              </button>
            )}

            <Link
              to="/help-center"
              className="w-full py-2.5 border border-gray-200 hover:border-[#ff6a00] text-gray-600 hover:text-[#ff6a00] rounded-xl text-xs font-bold transition-colors text-center block"
            >
              Need Help?
            </Link>
          </div>
        </div>

        {/* Right Column: Invoice & Details */}
        <div className="lg:col-span-2">
          <OrderInvoice order={order} />
        </div>
      </div>

      {/* Modals */}
      <CancelOrderModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={handleCancelOrder}
        isCancelling={isProcessing}
      />
      <ReturnRequestModal 
        isOpen={isReturnModalOpen} 
        onClose={() => setIsReturnModalOpen(false)} 
        onSubmit={handleReturnRequest}
        isSubmitting={isProcessing}
      />
    </div>
  );
};

export default OrderDetails;
