import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { productDetails } from '../../data/productDetails';
import { FiShoppingCart, FiHeart, FiEye, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CompareTable = () => {
  const { compareItems, removeFromCompare } = useCompare();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Specs helper
  const getSpecification = (product, label) => {
    // Find matching detailed product
    const details = productDetails.find(d => d.slug === product.slug);
    if (details?.specifications) {
      const match = details.specifications.find(s => s.label.toLowerCase() === label.toLowerCase());
      if (match) return match.value;
    }

    // Dynamic mock fallbacks based on category/brand
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('electronics') || cat.includes('mobile') || cat.includes('computer')) {
      switch (label.toLowerCase()) {
        case 'display':
          return product.name.includes('AirPods') ? 'N/A' : '15.6" Full HD OLED / 6.7" Super Retina';
        case 'processor':
          return product.name.includes('Apple') ? 'Apple H2 / Silicon' : 'Octa-core / Snapdragon';
        case 'ram':
          return product.name.includes('AirPods') ? 'N/A' : '8GB / 12GB';
        case 'storage':
          return product.name.includes('AirPods') ? 'N/A' : '256GB / 512GB';
        case 'battery':
          return product.name.includes('AirPods') ? 'Up to 30h with Case' : '5000 mAh / 18h Use';
        case 'camera':
          return product.name.includes('AirPods') ? 'N/A' : '50MP Quad / 12MP TrueDepth';
        case 'warranty':
          return '1 Year Brand Warranty';
        default:
          return '—';
      }
    }
    
    // Non-tech fallbacks
    if (label.toLowerCase() === 'warranty') {
      return '7 Days Return Policy';
    }
    return 'N/A';
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, null);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse table-fixed">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {/* Feature column */}
              <th className="w-1/5 p-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">
                Product Features
              </th>
              {/* Product slots */}
              {compareItems.map((item) => (
                <th key={item.id} className="p-4 text-left align-top relative border-l border-gray-100">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute top-2 right-2 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                    title="Remove from compare"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="h-28 w-full bg-white rounded-xl p-2 border border-gray-100 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                        {item.brand}
                      </p>
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#ff6a00] leading-snug"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="flex items-center gap-1.5 my-1">
                      <span className="text-[11px] font-bold text-gray-800">★ {item.rating}</span>
                      <span className="text-[10px] text-gray-400">({item.reviews || 0})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-[#ff6a00]">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded">
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
              {/* Fill remaining slots to make 4 columns if needed */}
              {Array.from({ length: 4 - compareItems.length }).map((_, idx) => (
                <th key={`empty-slot-${idx}`} className="p-4 text-center align-middle border-l border-gray-100 text-gray-300">
                  <div className="flex flex-col items-center justify-center py-10">
                    <span className="text-2xl font-light">+</span>
                    <p className="text-xs font-semibold mt-1">Empty Slot</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Spec Rows */}
            {[
              { key: 'display', label: 'Display' },
              { key: 'processor', label: 'Processor' },
              { key: 'ram', label: 'RAM Memory' },
              { key: 'storage', label: 'Storage' },
              { key: 'battery', label: 'Battery Life' },
              { key: 'camera', label: 'Camera Specs' },
              { key: 'warranty', label: 'Warranty' },
              { key: 'stock', label: 'Stock Status', render: (item) => (
                <span className={`text-xs font-semibold ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.stock > 0 ? `Available (${item.stock})` : 'Out of Stock'}
                </span>
              )}
            ].map((row) => (
              <tr key={row.key} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/20">
                  {row.label}
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 text-xs text-gray-700 font-medium border-l border-gray-100">
                    {row.render ? row.render(item) : getSpecification(item, row.key)}
                  </td>
                ))}
                {Array.from({ length: 4 - compareItems.length }).map((_, idx) => (
                  <td key={`empty-cell-${idx}`} className="p-4 border-l border-gray-100 text-gray-300 text-center font-light">
                    —
                  </td>
                ))}
              </tr>
            ))}

            {/* Bottom Actions Row */}
            <tr className="bg-gray-50/10">
              <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/20">
                Actions
              </td>
              {compareItems.map((item) => {
                const wStatus = isInWishlist(item.id);
                return (
                  <td key={item.id} className="p-4 border-l border-gray-100">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FiShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(item)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border ${
                          wStatus
                            ? 'border-red-200 bg-red-50/20 text-red-500'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <FiHeart className={`h-3.5 w-3.5 ${wStatus ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>Wishlist</span>
                      </button>
                      <Link
                        to={`/product/${item.slug}`}
                        className="w-full border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 text-center"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </td>
                );
              })}
              {Array.from({ length: 4 - compareItems.length }).map((_, idx) => (
                <td key={`empty-action-${idx}`} className="p-4 border-l border-gray-100 text-gray-300 text-center font-light">
                  —
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;
