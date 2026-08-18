import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiGift, FiShoppingCart, FiCheck, FiChevronRight } from 'react-icons/fi';
import bundleService from '../../services/bundleService';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import ProductCard from '../../components/Products/ProductCard';

const BundleDetails = () => {
  const { slug } = useParams();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refetch: refetchCart } = useCart();

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const data = await bundleService.getBundleBySlug(slug);
        setBundle(data);
      } catch (err) {
        setError('Bundle not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [slug]);

  const handleBuyBundle = async () => {
    try {
      await bundleService.addBundleToCart(bundle._id);
      toast.success('Bundle added to cart!');
      refetchCart();
    } catch (err) {
      toast.error('Failed to add bundle to cart');
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Bundle...</div>;
  if (error || !bundle) return <div className="p-10 text-center text-red-500">{error || 'Bundle not found'}</div>;

  const originalPrice = bundle.products.reduce((acc, p) => acc + (p.price || 0), 0);
  const finalPrice = bundle.fixedPrice || (originalPrice * (1 - bundle.discountPercentage / 100));

  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link to="/" className="hover:text-[#ff6a00]">Home</Link>
          <FiChevronRight />
          <Link to="/products?filter=bundles" className="hover:text-[#ff6a00]">Bundles</Link>
          <FiChevronRight />
          <span className="text-gray-900">{bundle.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-100 mb-8">
          
          {/* Bundle Image */}
          <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl flex items-center justify-center p-6 border border-gray-100">
            {bundle.image ? (
              <img src={bundle.image} alt={bundle.name} className="max-w-full h-auto object-contain mix-blend-multiply" />
            ) : (
              <div className="text-center text-gray-400 py-20">
                <FiGift className="h-20 w-20 mx-auto mb-4 text-purple-200" />
                No Image Available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Bundle Deal
                </span>
                {bundle.discountPercentage > 0 && (
                  <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                    Save {bundle.discountPercentage}%
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {bundle.name}
              </h1>
              <p className="text-gray-500 mt-3 max-w-2xl text-sm leading-relaxed">
                {bundle.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="block text-xs text-gray-500 font-bold mb-1">Total Bundle Price</span>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-gray-900">Rs. {finalPrice.toLocaleString()}</span>
                  {originalPrice > finalPrice && (
                    <span className="text-lg text-gray-400 line-through mb-1">Rs. {originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                  <FiCheck /> In Stock ({bundle.availableStock} available)
                </div>
              </div>

              <button 
                onClick={handleBuyBundle}
                disabled={!bundle.isAvailable}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                <FiShoppingCart /> Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Included Products */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Items Included in this Bundle ({bundle.products.length})</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {bundle.products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDetails;
