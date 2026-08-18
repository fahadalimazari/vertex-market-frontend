import { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiShoppingCart, FiCreditCard, FiX, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../../../context/CartContext'
import { calculateCartSubtotal } from '../../../utils/cartCalculations'

const MiniCart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart()
  const subtotal = calculateCartSubtotal(cartItems)

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 z-[100] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[400px] max-w-[100vw] bg-white shadow-2xl z-[101] flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="text-[18px] font-black text-gray-900 flex items-center gap-3">
            <FiShoppingCart className="text-orange-600" /> 
            Your Cart
            <span className="text-[11px] font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full ml-2 uppercase tracking-wider">
              {cartItems.length} Items
            </span>
          </h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FiShoppingCart className="text-4xl text-gray-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h4>
              <p className="text-[14px] text-gray-500 mb-8 max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
              <button 
                onClick={onClose}
                className="bg-gray-900 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const itemId = item._id || item.productId?._id || item.productId;
              const name = item.snapshotName || item.productId?.name || 'Product';
              const image = item.snapshotImage || item.productId?.image || '/placeholder.png';
              const price = item.effectivePrice || item.unitPrice || 0;

              return (
                <div key={itemId} className="flex gap-4 group relative bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 p-2 flex items-center justify-center border border-gray-50">
                    <img src={image} alt={name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0 py-1">
                    <h4 className="text-[14px] font-bold text-gray-900 truncate pr-8">{name}</h4>
                    <div className="text-[12px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                      Qty: {item.quantity} &times; Rs. {price.toLocaleString()}
                    </div>
                    <div className="text-[15px] font-black text-orange-600 mt-auto">
                      Rs. {(item.quantity * price).toLocaleString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors focus:outline-none w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <FiTrash2 className="text-[14px]" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl">
              <span className="text-[15px] font-bold text-gray-600 uppercase tracking-wider">Subtotal</span>
              <span className="text-[20px] font-black text-gray-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full py-4 text-[15px] font-black tracking-wide text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
              >
                <FiCreditCard className="text-xl" />
                Proceed to Checkout
              </Link>
              
              <Link
                to="/cart"
                onClick={onClose}
                className="w-full py-4 text-[14px] font-bold text-gray-900 bg-white border-2 border-gray-100 rounded-xl hover:border-gray-900 transition-colors text-center flex items-center justify-center gap-2"
              >
                View Full Cart
                <FiArrowRight />
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </>
  )
}

export default memo(MiniCart)
