import { useEffect, useMemo } from 'react';
import { useProduct } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useAI } from '../../context/AIContext';
import { FiStar, FiHeart, FiGitPullRequest, FiFolderPlus, FiShare2, FiCpu, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductInfo = ({ product, details, onOpenShare }) => {
  const { 
    selectedColor, setSelectedColor,
    selectedStorage, setSelectedStorage,
    quantity, setQuantity,
    setActiveImageIndex
  } = useProduct();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, compareItems } = useCompare();
  const { sendMessage, setIsOpen } = useAI();

  // Extract colors and storages from variants object safely
  const colors = useMemo(() => details.variants?.colors || [], [details]);
  const storages = useMemo(() => details.variants?.storage || [], [details]);

  // Set default variants if empty
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
    if (storages.length > 0 && !selectedStorage) setSelectedStorage(storages[0]);
  }, [colors, storages, selectedColor, selectedStorage, setSelectedColor, setSelectedStorage]);

  // The active variant logic (fallback to base product if no complex variant system is used yet)
  const activeVariant = useMemo(() => {
    return null; // Mocking direct variant selection for now to prevent crashes
  }, [details, selectedColor, selectedStorage]);

  // Update gallery image to variant image when variant changes
  useEffect(() => {
    if (activeVariant?.image) {
      const idx = details.gallery.findIndex(img => img === activeVariant.image);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [activeVariant, details, setActiveImageIndex]);

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const currentSku = activeVariant ? activeVariant.sku : `SKU-${1000 + product.id}`;

  const discountAmount = product.oldPrice ? product.oldPrice - currentPrice : 0;

  const handleAskAI = (promptType) => {
    let msg = '';
    switch (promptType) {
      case 'worth':
        msg = `Is the ${product.name} worth buying at Rs. ${currentPrice.toLocaleString()}?`;
        break;
      case 'pros':
        msg = `What are the pros and cons of the ${product.name}?`;
        break;
      case 'compare':
        msg = `Compare ${product.name} with similar flagship smartphones in the market.`;
        break;
      default:
        msg = `Tell me more about ${product.name} specifications.`;
    }
    setIsOpen(true);
    sendMessage(msg);
  };

  const handleAddToCart = () => {
    if (currentStock === 0) {
      toast.error('Selected variant is out of stock!');
      return;
    }
    addToCart({
      id: `${product.id}-${selectedColor}-${selectedStorage}`,
      name: `${product.name} (${selectedColor} / ${selectedStorage})`,
      price: currentPrice,
      image: activeVariant?.image || product.image,
      quantity,
      brand: product.brand,
      category: product.category
    });
    toast.success('Added to Cart!');
  };

  return (
    <div className="space-y-6">
      {/* Title Details */}
      <div className="space-y-2">
        <span className="text-[10px] bg-orange-50 text-[#ff6a00] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Official {product.brand} Store
        </span>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-semibold">
          <span className="flex items-center gap-0.5 text-orange-500">
            <FiStar className="h-3.5 w-3.5 fill-orange-500" /> {product.rating}
          </span>
          <span>•</span>
          <span>{product.reviews || 0} Ratings</span>
          <span>•</span>
          <span className="text-gray-900">{product.sold || 500}+ Sold</span>
          <span>•</span>
          <span className="text-gray-500">{product.viewCount || 1000} Views</span>
          <span>•</span>
          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">SKU: {currentSku}</span>
        </div>
      </div>

      {/* Pricing box */}
      <div className="bg-gray-50 p-5 rounded-3xl border border-gray-150 space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-black text-gray-900">
            Rs. {currentPrice.toLocaleString()}
          </span>
          {product.oldPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                Rs. {product.oldPrice.toLocaleString()}
              </span>
              <span className="text-[10px] bg-[#ff6a00] text-white font-bold px-1.5 py-0.5 rounded-lg">
                -{product.discount}%
              </span>
            </>
          )}
        </div>

        {discountAmount > 0 && (
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
            You Save: Rs. {discountAmount.toLocaleString()}
          </p>
        )}

        {/* Installements / EMI info */}
        <div className="text-[10px] text-gray-500 border-t border-gray-150 pt-3 flex items-center justify-between">
          <span>EMI Plans: From Rs. 12,500/month</span>
          <span className="text-[#ff6a00] hover:underline font-bold cursor-pointer">Learn More</span>
        </div>
      </div>

      {/* Variant Selection Color / Storage */}
      <div className="space-y-4">
        {/* Colors */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Color: {selectedColor}</span>
          <div className="flex gap-2">
            {colors.map(col => (
              <button
                key={col}
                onClick={() => setSelectedColor(col)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedColor === col 
                    ? 'border-[#ff6a00] bg-orange-50/20 text-[#ff6a00] shadow-sm' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Storage: {selectedStorage}</span>
          <div className="flex gap-2">
            {storages.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStorage(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedStorage === st 
                    ? 'border-[#ff6a00] bg-orange-50/20 text-[#ff6a00] shadow-sm' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity & Stock Level */}
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quantity:</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button 
            disabled={quantity <= 1}
            onClick={() => setQuantity(prev => prev - 1)}
            className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-30"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={currentStock || 1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock || 1, Number(e.target.value))))}
            className="w-10 text-center text-xs font-bold outline-none border-x border-gray-150 py-1"
          />
          <button 
            disabled={quantity >= currentStock}
            onClick={() => setQuantity(prev => prev + 1)}
            className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-30"
          >
            +
          </button>
        </div>
        <span className={`text-[10px] font-bold uppercase ${
          currentStock === 0 
            ? 'text-red-500 animate-pulse' 
            : currentStock < 5 
              ? 'text-orange-500' 
              : 'text-green-600'
        }`}>
          {currentStock === 0 ? 'Out of stock' : `${currentStock} units available`}
        </span>
      </div>

      {/* Primary Actions (Buy Now, Add to Cart) */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleAddToCart}
          className="bg-orange-50 hover:bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] py-3 rounded-2xl text-xs font-bold transition-all"
        >
          Add to Cart
        </button>
        <button
          onClick={() => {
            handleAddToCart();
            window.location.href = '/checkout';
          }}
          className="bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md"
        >
          Buy Now
        </button>
      </div>

      {/* Secondary Actions (Wishlist, Compare, Collection, Share, AI) */}
      <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-600 border-t border-gray-100 pt-4">
        <button
          onClick={() => toggleWishlist(product)}
          className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl hover:bg-gray-50 transition-colors ${
            isInWishlist(product.id) ? 'text-red-500 border-red-200 bg-red-50/10' : 'border-gray-200'
          }`}
        >
          <FiHeart className={isInWishlist(product.id) ? 'fill-red-500' : ''} />
          <span>Wishlist</span>
        </button>

        <button
          onClick={() => {
            addToCompare(product);
          }}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <FiGitPullRequest />
          <span>Compare</span>
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <FiShare2 />
          <span>Share</span>
        </button>
      </div>

      {/* AI Assistant Quick Actions Panel */}
      <div className="bg-[#ff6a00]/5 border border-[#ff6a00]/25 rounded-3xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
          <FiCpu className="text-[#ff6a00]" /> AI Shopper Assistant
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-700">
          <button onClick={() => handleAskAI('worth')} className="text-left bg-white border border-gray-150 p-2.5 rounded-xl hover:border-[#ff6a00] hover:text-[#ff6a00] transition-all">
            Worth buying?
          </button>
          <button onClick={() => handleAskAI('pros')} className="text-left bg-white border border-gray-150 p-2.5 rounded-xl hover:border-[#ff6a00] hover:text-[#ff6a00] transition-all">
            Pros & Cons list
          </button>
          <button onClick={() => handleAskAI('compare')} className="text-left bg-white border border-gray-150 p-2.5 rounded-xl hover:border-[#ff6a00] hover:text-[#ff6a00] transition-all">
            Compare flagship models
          </button>
          <button onClick={() => handleAskAI('specs')} className="text-left bg-white border border-gray-150 p-2.5 rounded-xl hover:border-[#ff6a00] hover:text-[#ff6a00] transition-all">
            Explain technical specs
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductInfo;
