import { FiX, FiDownload } from 'react-icons/fi'
import StatusBadge from './StatusBadge'

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
            <p className="text-[13px] text-gray-500 mt-1">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors focus:outline-none"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Shipping</p>
              <p className="text-[14px] font-bold text-gray-900">{order.shippingMethod}</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Payment</p>
              <p className="text-[14px] font-bold text-gray-900">{order.paymentMethod}</p>
            </div>
          </div>

          <h4 className="text-[15px] font-bold text-gray-900 mb-4">Items Ordered</h4>
          <div className="flex flex-col gap-4">
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[14px] font-bold text-gray-900 truncate">{item.name}</h5>
                  <p className="text-[13px] text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-[14px] font-bold text-[#ff6a00] flex-shrink-0">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center text-[16px] font-bold text-gray-900">
              <span>Grand Total</span>
              <span className="text-xl text-[#ff6a00]">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-[14px] font-bold hover:bg-gray-100 transition-colors focus:outline-none"
          >
            Close
          </button>
          <button 
            onClick={() => alert(`Downloading Invoice for ${order.id}...`)}
            className="px-6 py-2.5 rounded-xl bg-[#ff6a00] text-white text-[14px] font-bold hover:bg-[#e65c00] transition-colors focus:outline-none flex items-center gap-2"
          >
            <FiDownload />
            Download Invoice
          </button>
        </div>

      </div>
    </div>
  )
}

export default OrderDetailsModal
