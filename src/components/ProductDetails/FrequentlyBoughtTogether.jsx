import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FiPlus, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FrequentlyBoughtTogether = ({ product, currentPrice, bundleItems }) => {
  const { addToCart } = useCart();
  const [checkedItems, setCheckedItems] = useState([true, true]); // accessories checked flags

  const handleCheckboxChange = (index) => {
    setCheckedItems(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const totalPrice = currentPrice + bundleItems.reduce((acc, item, idx) => {
    return acc + (checkedItems[idx] ? item.price : 0);
  }, 0);

  const handleAddBundle = () => {
    // Add primary item
    addToCart({
      id: `${product.id}-bundle`,
      name: product.name,
      price: currentPrice,
      image: product.image,
      quantity: 1,
      brand: product.brand,
      category: product.category
    });

    // Add accessories
    bundleItems.forEach((item, idx) => {
      if (checkedItems[idx]) {
        addToCart({
          id: `acc-${item.id}`,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          brand: 'VertexCare',
          category: 'Accessories'
        });
      }
    });

    toast.success('Bundle added to Cart successfully!');
  };

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900">Frequently Bought Together</h3>
        <p className="text-[10px] text-gray-500 mt-0.5">Save time by bundling flagship accessories together.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
        {/* Main Item */}
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 bg-gray-50 border border-gray-100 p-2 rounded-xl flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 max-w-[120px] truncate">{product.name}</p>
            <p className="text-[10px] text-[#ff6a00] font-bold mt-0.5">Rs. {currentPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Plus accessory 1 */}
        {bundleItems[0] && (
          <>
            <FiPlus className="text-gray-400" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={checkedItems[0]}
                  onChange={() => handleCheckboxChange(0)}
                  className="h-4.5 w-4.5 rounded border-gray-300 text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
                />
                <div className="h-16 w-16 bg-gray-50 border border-gray-100 p-2 rounded-xl flex items-center justify-center">
                  <img src={bundleItems[0].image} alt={bundleItems[0].name} className="max-h-full max-w-full object-contain" />
                </div>
              </label>
              <div>
                <p className="text-xs font-bold text-gray-900 max-w-[120px] truncate">{bundleItems[0].name}</p>
                <p className="text-[10px] text-[#ff6a00] font-bold mt-0.5">Rs. {bundleItems[0].price.toLocaleString()}</p>
              </div>
            </div>
          </>
        )}

        {/* Plus accessory 2 */}
        {bundleItems[1] && (
          <>
            <FiPlus className="text-gray-400" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={checkedItems[1]}
                  onChange={() => handleCheckboxChange(1)}
                  className="h-4.5 w-4.5 rounded border-gray-300 text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
                />
                <div className="h-16 w-16 bg-gray-50 border border-gray-100 p-2 rounded-xl flex items-center justify-center">
                  <img src={bundleItems[1].image} alt={bundleItems[1].name} className="max-h-full max-w-full object-contain" />
                </div>
              </label>
              <div>
                <p className="text-xs font-bold text-gray-900 max-w-[120px] truncate">{bundleItems[1].name}</p>
                <p className="text-[10px] text-[#ff6a00] font-bold mt-0.5">Rs. {bundleItems[1].price.toLocaleString()}</p>
              </div>
            </div>
          </>
        )}

        {/* Total bundle price buy panel */}
        <div className="sm:ml-auto border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 text-center sm:text-left space-y-2">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bundle Price</span>
            <span className="text-lg font-black text-gray-900">Rs. {totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={handleAddBundle}
            className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1 mx-auto sm:mx-0"
          >
            <FiCheck />
            <span>Add Selected to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
