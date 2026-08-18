import { useEffect, useState } from 'react';
import { getFrequentlyBoughtTogether } from '../../services/recommendationService';
import { FiPlus } from 'react-icons/fi';

const CustomersAlsoBought = ({ currentProduct }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (currentProduct?.id) {
      getFrequentlyBoughtTogether(currentProduct.id).then(setItems);
    }
  }, [currentProduct]);

  if (items.length === 0) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.price, currentProduct?.price || 0);

  return (
    <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Frequently Bought Together</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1">
          {/* Current Product */}
          <div className="w-24 h-24 bg-white rounded-xl p-2 border border-orange-200 shadow-sm shrink-0">
            <img src={currentProduct?.image || 'https://placehold.co/100'} alt="Current" className="w-full h-full object-contain" />
          </div>
          
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-4">
              <FiPlus className="text-gray-400 text-xl shrink-0" />
              <div className="w-24 h-24 bg-white rounded-xl p-2 border border-gray-200 shadow-sm shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-w-[200px] text-center md:text-left">
          <div className="text-sm text-gray-500 mb-1">Total Price:</div>
          <div className="text-2xl font-bold text-orange-600 mb-4">${totalPrice.toFixed(2)}</div>
          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-xl transition-colors">
            Add All To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomersAlsoBought;
