import { memo } from 'react';
import { FiPlus, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const BundleOffer = memo(({ bundle }) => {
  const { addToCart } = useCart();

  // In a real app, you would fetch actual product details for each item in bundle.items
  // For the UI, we'll render placeholders or generic info based on the bundle data.

  const handleAddBundle = () => {
    // Mock adding bundle items to cart
    bundle.items.forEach(itemId => {
      addToCart({
        id: itemId,
        name: `Bundle Item ${itemId}`,
        price: 100, // Dummy price
        slug: `product-${itemId}`,
        stock: 10
      });
    });
    toast.success('Bundle added to cart!');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ff6a00]/30 shadow-sm overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-orange-50 to-[#ff6a00]/5 p-4 border-b border-[#ff6a00]/20 flex justify-between items-center">
        <div>
          <span className="bg-[#ff6a00] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider mb-1 inline-block">
            Bundle Offer
          </span>
          <h3 className="font-bold text-gray-900">{bundle.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 line-through">Retail: $350</div>
          <div className="text-lg font-black text-[#ff6a00]">
            Save {bundle.discountType === 'percentage' ? `${bundle.discountValue}%` : `$${bundle.discountValue}`}
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-600 mb-6">{bundle.description}</p>

        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          {bundle.items.map((item, idx) => (
            <div key={item} className="flex items-center gap-4 flex-shrink-0">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <FiShoppingBag className="text-gray-400" size={24} />
              </div>
              {idx < bundle.items.length - 1 && (
                <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-100 flex-shrink-0">
                  <FiPlus size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <FiInfo /> All items must be in cart to apply
          </div>
          <button 
            onClick={handleAddBundle}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
          >
            Add Bundle to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

BundleOffer.displayName = 'BundleOffer';
export default BundleOffer;
