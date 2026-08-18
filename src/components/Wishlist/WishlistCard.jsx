import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiShare2, FiGitCommit, FiRepeat } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import SellerBadge from '../common/SellerBadge';

const WishlistCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const { removeFromWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart(product, 1, null);
    toast.success(`${product.name} added to cart`);
  };

  const handleShare = () => {
    const dummyUrl = `${window.location.origin}/product/${product.slug}`;
    navigator.clipboard.writeText(dummyUrl);
    toast.success('Product link copied to clipboard!');
  };

  const inCompare = isInCompare(product.id || product.productId || product._id);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all duration-300 group flex flex-col h-full relative">
      
      {/* Remove Button Overlay */}
      <button
        onClick={() => removeFromWishlist(product.id || product.productId || product._id)}
        className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full border border-gray-100 shadow-sm transition-colors z-10"
        title="Remove from wishlist"
      >
        <FiTrash2 className="h-4 w-4" />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300"
        />
      </Link>

      {/* Details info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 line-clamp-1 max-w-[120px]">
              {product.seller?.name || (typeof product.brand === 'object' ? product.brand?.name : product.brand)}
              <SellerBadge badges={product.seller?.badges} />
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <Link to={`/product/${product.slug}`} className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 hover:text-[#ff6a00] transition-colors mb-2">
            {product.name}
          </Link>

          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-bold text-gray-800">★ {product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.reviews || 0} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-[#ff6a00]">Rs. {product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">Rs. {product.oldPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-[#ff6a00] hover:bg-[#e05e00] disabled:bg-gray-100 disabled:text-gray-400 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <FiShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleCompare(product)}
              className={`flex items-center justify-center gap-1 px-2.5 py-2 border rounded-xl text-xs font-bold transition-colors ${
                inCompare
                  ? 'border-[#ff6a00] text-[#ff6a00] bg-orange-50/20'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
              title="Compare specs"
            >
              <FiRepeat className="h-3.5 w-3.5" />
              <span>{inCompare ? 'Compare ✔' : 'Compare'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1 px-2.5 py-2 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl text-xs font-bold transition-colors hover:bg-gray-50"
              title="Share Link"
            >
              <FiShare2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WishlistCard;
