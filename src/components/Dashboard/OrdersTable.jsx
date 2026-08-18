import { FiEye, FiDownload, FiMapPin, FiPackage } from 'react-icons/fi'
import StatusBadge from './StatusBadge'
import toast from 'react-hot-toast'

const OrdersTable = ({ orders, onViewOrder }) => {
  const handleDownload = (id) => {
    toast.success(`Downloading Invoice for ${id}...`)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Order ID</th>
              <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Date</th>
              <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Items</th>
              <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Total</th>
              <th className="py-4 px-6 text-[13px] font-bold text-gray-700">Status</th>
              <th className="py-4 px-6 text-[13px] font-bold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-[14px] font-bold text-gray-900">{order.id}</td>
                <td className="py-4 px-6 text-[14px] text-gray-600">
                  {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="py-4 px-6 text-[14px] text-gray-600">
                  {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                </td>
                <td className="py-4 px-6 text-[14px] font-bold text-gray-900">
                  Rs. {order.total.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onViewOrder(order)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#ff6a00] hover:text-white transition-colors focus:outline-none" 
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#ff6a00] hover:text-white transition-colors focus:outline-none" 
                      title="Download Invoice"
                      onClick={() => handleDownload(order.id)}
                    >
                      <FiDownload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiPackage className="text-4xl text-gray-300 mb-2" />
                    <p className="text-[15px] font-bold text-gray-900">No orders found</p>
                    <p className="text-[13px] text-gray-500">Try changing your filters or browse our products.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable
