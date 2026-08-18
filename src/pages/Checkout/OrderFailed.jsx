import { Link } from 'react-router-dom';
import { FiXCircle, FiRefreshCw, FiMessageCircle, FiArrowLeft } from 'react-icons/fi';

const OrderFailed = () => {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-2xl w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <FiXCircle size={48} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 text-lg mb-8">
          We couldn't process your payment. This could be due to a network issue, insufficient funds, or incorrect details.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link 
            to="/checkout"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#ff6a00] text-white font-bold hover:bg-[#e65c00] transition-colors flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Retry Payment
          </Link>
          <Link 
            to="/contact"
            className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <FiMessageCircle /> Contact Support
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <Link 
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors"
          >
            <FiArrowLeft /> Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
