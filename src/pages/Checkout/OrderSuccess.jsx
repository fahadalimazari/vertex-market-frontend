import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiShoppingBag, FiTruck } from 'react-icons/fi';
import InvoiceModal from '../../components/Checkout/InvoiceModal';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || `ORD-${Date.now()}`;
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    // In a real app, we might verify the orderId via API here
  }, [orderId]);

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-2xl w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <FiCheckCircle size={48} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for shopping with Vertex Market. Your order <span className="font-bold text-gray-900">#{orderId}</span> has been confirmed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button 
            onClick={() => setIsInvoiceOpen(true)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <FiDownload /> View Invoice
          </button>
          <Link 
            to="/dashboard/orders"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#ff6a00] text-white font-bold hover:bg-[#e65c00] transition-colors flex items-center justify-center gap-2"
          >
            <FiTruck /> Track Order
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[#ff6a00] font-semibold hover:text-[#e65c00] transition-colors"
          >
            <FiShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>

      {isInvoiceOpen && (
        <InvoiceModal orderId={orderId} onClose={() => setIsInvoiceOpen(false)} />
      )}
    </div>
  );
};

export default OrderSuccess;
