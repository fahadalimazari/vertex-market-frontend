import { memo } from 'react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderInvoice = memo(({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Invoice downloaded successfully (simulation)');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-3xl mx-auto shadow-sm">
      <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">INVOICE</h2>
          <p className="text-sm text-gray-500 mt-1">Vertex Market</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">Order ID: {order.id}</p>
          <p className="text-xs text-gray-500 mt-1">Date: {new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
          <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
          <p className="text-xs text-gray-500 mt-1">{order.deliveryAddress.street}</p>
          <p className="text-xs text-gray-500">{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}</p>
          <p className="text-xs text-gray-500 mt-1">{order.deliveryAddress.phone}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Details</h3>
          <p className="text-sm font-bold text-gray-900">{order.paymentMethod}</p>
          <p className={`text-xs mt-1 font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
            Status: {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4 items-center px-2">
                <div className="col-span-6">
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Seller: {item.sellerName}</p>
                </div>
                <div className="col-span-2 text-center text-sm text-gray-900">{item.quantity}</div>
                <div className="col-span-2 text-right text-sm text-gray-900">Rs. {item.price.toLocaleString()}</div>
                <div className="col-span-2 text-right text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount {order.couponUsed ? `(${order.couponUsed})` : ''}</span>
              <span className="font-medium">-Rs. {order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span className="font-medium">Rs. {order.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span className="font-medium">Rs. {order.shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="font-bold text-gray-900">Grand Total</span>
            <span className="text-xl font-black text-[#ff6a00]">Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <FiPrinter /> Print
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <FiDownload /> Download PDF
        </button>
      </div>
    </div>
  );
});

OrderInvoice.displayName = 'OrderInvoice';
export default OrderInvoice;
