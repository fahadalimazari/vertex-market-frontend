import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiGift, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import bundleService from '../../services/bundleService';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

const BundleDealsSection = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refetch: refetchCart } = useCart();

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const data = await bundleService.getBundles();
        setBundles(data.slice(0, 4)); // Show up to 4 on home
      } catch (err) {
        console.error('Failed to load bundles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const handleBuyBundle = async (bundleId) => {
    try {
      await bundleService.addBundleToCart(bundleId);
      toast.success('Bundle added to cart!');
      refetchCart();
    } catch (err) {
      toast.error('Failed to add bundle to cart');
    }
  };

  if (loading || bundles.length === 0) return null;

  return (
    <div className="py-2">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiGift className="text-purple-500" /> Bundle Deals
          </h2>
          <p className="text-sm text-gray-500 mt-1">Buy more, save more with our curated bundles.</p>
        </div>
        <Link to="/products?filter=bundles" className="text-sm font-bold bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors shadow-sm">
          View All Bundles
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map((bundle) => {
          const originalPrice = bundle.products.reduce((acc, p) => acc + (p.price || 0), 0);
          const finalPrice = bundle.fixedPrice || (originalPrice * (1 - bundle.discountPercentage / 100));

          return (
            <motion.div 
              key={bundle._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{bundle.name}</h3>
                  {bundle.discountPercentage > 0 && (
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                      Save {bundle.discountPercentage}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
                  {bundle.products.map((item, idx) => (
                    <div key={item._id} className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 border border-gray-100 group-hover:border-purple-200 transition-colors">
                          <img src={item.images?.[0] || 'https://via.placeholder.com/200?text=Product'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" loading="lazy" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 max-w-[80px] text-center truncate">{item.name}</span>
                      </div>
                      {idx < bundle.products.length - 1 && (
                        <div className="text-gray-300 font-bold mb-4"><FiPlus /></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                <div>
                  <span className="block text-[11px] text-gray-500 font-medium mb-1">Bundle Price</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900">Rs. {finalPrice.toLocaleString()}</span>
                    {originalPrice > finalPrice && (
                      <span className="text-xs text-gray-400 line-through">Rs. {originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleBuyBundle(bundle._id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-purple-600/20"
                >
                  <FiShoppingCart /> Buy Bundle
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BundleDealsSection;
