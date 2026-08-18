import { useCheckout } from '../../hooks/useCheckout';

const BillingSummary = () => {
  const { subtotal, discount, deliveryFee, tax, total, cartItems } = useCheckout();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-6">Order Summary</h3>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item._id || item.id} className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
              <img src={item.snapshotImage || item.image} alt={item.snapshotName || item.name} className="w-full h-full object-cover" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{item.snapshotName || item.name || item.title}</h4>
              {item.snapshotVariant && (
                <p className="text-xs text-gray-500 truncate">
                  {item.snapshotVariant}
                </p>
              )}
            </div>
            <div className="font-bold text-gray-900">
              Rs. {((item.effectivePrice || item.unitPrice || item.price) * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">- Rs. {discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span className="font-medium text-gray-900">Rs. {deliveryFee.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span className="font-medium text-gray-900">Rs. {tax.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">Grand Total</span>
        <span className="text-2xl font-bold text-[#ff6a00]">Rs. {total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BillingSummary;
