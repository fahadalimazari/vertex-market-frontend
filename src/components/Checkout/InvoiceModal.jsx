import { FiX, FiPrinter, FiDownload } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';

const InvoiceModal = ({ orderId, onClose }) => {
  // In a real scenario, we'd fetch the specific order details by orderId from the service.
  // For the demo immediately after placement, we might use checkout state history or mock data.
  // We'll use mock placeholders for now since the order was just placed.
  const { subtotal, discount, deliveryFee, tax, total, cartItems } = useCheckout();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8 relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-xl text-gray-900">Invoice</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors tooltip-trigger"
              title="Print"
            >
              <FiPrinter size={20} />
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
              title="Download PDF"
            >
              <FiDownload size={20} />
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ml-2"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-8" id="invoice-content">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-black text-[#ff6a00] mb-2">VERTEX</h1>
              <p className="text-gray-500 text-sm">Marketplace</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-gray-600 font-mono mt-1">{orderId}</p>
              <p className="text-gray-500 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 text-left font-bold text-gray-900">Item</th>
                <th className="py-3 text-center font-bold text-gray-900">Qty</th>
                <th className="py-3 text-right font-bold text-gray-900">Price</th>
                <th className="py-3 text-right font-bold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    {item.variant && <p className="text-xs text-gray-500">{Object.values(item.variant).join(', ')}</p>}
                  </td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">Rs. {item.price.toLocaleString()}</td>
                  <td className="py-4 text-right font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="font-bold text-xl text-[#ff6a00]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
