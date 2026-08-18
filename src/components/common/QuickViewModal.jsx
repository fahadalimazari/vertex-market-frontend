import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiHeart, FiShoppingCart, FiBarChart2, FiShare2, FiStar, 
  FiTruck, FiShield, FiCheckCircle, FiInfo, FiChevronRight, FiCpu, 
  FiTrendingUp, FiCheck
} from 'react-icons/fi';
import SellerBadge from './SellerBadge';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import axios from 'axios';

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();
  const navigate = useNavigate();

  const [fullProduct, setFullProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      document.body.style.overflow = 'hidden';
      // Reset states
      setActiveImage(product.gallery?.[0] || product.image);
      setQuantity(1);
      
      const fetchFullProduct = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:5000/api/products/${product.slug}`);
          const data = res.data.data;
          setFullProduct(data);
          setActiveImage(data.image || product.image);
          // Assuming variants is an array of objects now
          if (data.variants && data.variants.length > 0) {
            const firstVar = data.variants[0];
            if (firstVar.attributes) {
              const keys = Object.keys(firstVar.attributes);
              if (keys[0]) setSelectedColor(firstVar.attributes[keys[0]]);
              if (keys[1]) setSelectedSize(firstVar.attributes[keys[1]]);
            }
          }
        } catch (error) {
          console.error('Failed to fetch full product details', error);
        } finally {
          setLoading(false);
        }
      };

      fetchFullProduct();

    } else {
      document.body.style.overflow = 'auto';
      setFullProduct(null);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, product]);

  const displayProduct = fullProduct || product;

  if (!isOpen || !product) return null;

  const isWishlisted = isInWishlist(product.id || product.slug);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddToCart = () => {
    addToCart({ ...displayProduct, quantity, selectedColor, selectedSize, selectedStorage });
    toast.success(`${displayProduct.name || product.name} added to cart!`);
    // Optional: Close modal after add
    // onClose();
  };

  const handleBuyNow = () => {
    addToCart({ ...displayProduct, quantity, selectedColor, selectedSize, selectedStorage });
    onClose();
    navigate('/cart');
  };

  const handleCompare = () => {
    addToCompare(product);
  };

  const gallery = product.gallery || [product.image];

  // Helper to safely render strings or extract 'name' from objects
  const getDisplayName = (field) => {
    if (!field) return null;
    if (typeof field === 'object') return field.name || '';
    return String(field);
  };

  const brandName = getDisplayName(displayProduct.brand);
  const categoryName = getDisplayName(displayProduct.category);
  const subCategoryName = getDisplayName(displayProduct.subCategory);
  const actualSellerName = getDisplayName(displayProduct.seller) || displayProduct.sellerName;
  const reviewCount = Array.isArray(displayProduct.reviews) ? displayProduct.reviews.length : (displayProduct.numReviews || displayProduct.reviews || 0);
  const ratingValue = Number(displayProduct.rating) || 0;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-2 sm:p-4 md:p-6"
        onClick={handleBackdropClick}
      >
        <motion.div 
          className="bg-white w-full max-w-6xl max-h-[95vh] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          >
            <FiX className="text-xl" />
          </button>

          <div className="flex flex-col lg:flex-row h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
            
            {/* Left Column: Media Gallery */}
            <div className="w-full lg:w-5/12 bg-gray-50 p-6 md:p-8 flex flex-col relative shrink-0 border-r border-gray-100">
              {/* Badges */}
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                {displayProduct.discount > 0 && (
                  <span className="bg-[#ff6a00] text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                    {displayProduct.discount}% OFF
                  </span>
                )}
                {displayProduct.isAiRecommended && (
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1">
                    <FiStar /> AI Pick
                  </span>
                )}
                {displayProduct.isFlashSale && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                    Flash Sale
                  </span>
                )}
              </div>

              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl mb-4 flex items-center justify-center p-4 border border-gray-100 group overflow-hidden">
                {activeImage ? (
                  <img 
                    src={activeImage} 
                    alt={getDisplayName(displayProduct.name) || 'Product Image'} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-125 transition-transform duration-500 cursor-zoom-in"
                  />
                ) : (
                  <div className="text-gray-300 font-medium text-sm">No Image</div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 shrink-0 rounded-xl bg-white border-2 overflow-hidden flex items-center justify-center p-1 transition-colors ${
                      activeImage === img ? 'border-[#ff6a00]' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="w-full lg:w-7/12 p-6 md:p-8 flex flex-col bg-white">
              
              {/* Core Info */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {brandName && <span>{brandName}</span>}
                  {brandName && categoryName && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                  {categoryName && <span>{categoryName}</span>}
                  {categoryName && subCategoryName && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                  {subCategoryName && <span>{subCategoryName}</span>}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-3">
                  {getDisplayName(displayProduct.name)}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < Math.floor(ratingValue) ? 'fill-current' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="font-bold text-gray-700 ml-1">{ratingValue.toFixed(1)}</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">({reviewCount} Reviews)</span>
                  </div>
                  
                  <div className="w-px h-4 bg-gray-300"></div>
                  
                  <div className="flex items-center gap-1 text-gray-600 font-medium">
                    <FiTrendingUp className="text-green-500" />
                    <span>{displayProduct.sold || 500}+ Sold</span>
                  </div>

                  <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>

                  <div className="flex items-center gap-1 text-gray-500 text-xs hidden sm:flex">
                    <span>SKU: {displayProduct.sku || 'N/A'}</span>
                  </div>
                </div>

                {(actualSellerName) && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-500">Sold by:</span>
                    <div className="flex items-center gap-1.5">
                      <Link to={`/seller/${actualSellerName}`} className="text-sm font-bold text-[#ff6a00] hover:underline" onClick={onClose}>
                        {actualSellerName}
                      </Link>
                      <SellerBadge badges={displayProduct.seller?.badges} />
                    </div>
                  </div>
                )}
                
                {/* Short Description */}
                {displayProduct.shortDescription && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {displayProduct.shortDescription}
                  </p>
                )}

                {/* Highlights */}
                {displayProduct.highlights && displayProduct.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {displayProduct.highlights.slice(0, 4).map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <FiCheck className="text-green-500 mt-0.5 shrink-0" />
                        <span>{highlight.value || highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pricing Box */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-3xl font-black text-[#ff6a00]">
                      Rs. {displayProduct.price?.toLocaleString()}
                    </span>
                    {displayProduct.oldPrice && (
                      <span className="text-lg text-gray-400 line-through mb-1">
                        Rs. {displayProduct.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {displayProduct.oldPrice > displayProduct.price && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide border border-emerald-100">
                        Price Dropped
                      </span>
                    )}
                    {displayProduct.emiAvailable && (
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Installment Available
                      </span>
                    )}
                  </div>
                </div>
                
                {displayProduct.stock > 0 ? (
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600 mb-1">In Stock</div>
                    <div className="text-xs text-gray-500">Usually ships in 24 hrs</div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-600 mb-1">Out of Stock</div>
                  </div>
                )}
              </div>

              {/* Variants Selection */}
              <div className="space-y-5 mb-6">
                {/* Colors */}
                {displayProduct.variants?.colors?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">
                      Color: <span className="text-gray-500 font-normal">{selectedColor}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {displayProduct.variants.colors.map(color => (
                        <button 
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                            selectedColor === color 
                              ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00] ring-1 ring-[#ff6a00]' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Storage/RAM combined conceptually here for demo */}
                {displayProduct.variants?.storage?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">
                      Storage: <span className="text-gray-500 font-normal">{selectedStorage}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {displayProduct.variants.storage.map(st => (
                        <button 
                          key={st}
                          onClick={() => setSelectedStorage(st)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                            selectedStorage === st 
                              ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00] ring-1 ring-[#ff6a00]' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery & Services */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-gray-400"><FiTruck className="text-lg" /></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">Standard Delivery</div>
                    <div className="text-xs text-gray-500">{displayProduct.deliveryDate || '3-5 Business Days'}</div>
                    <div className="text-xs font-bold text-green-600 mt-1">{displayProduct.shippingFee === 0 ? 'Free Shipping' : `Rs. ${displayProduct.shippingFee || 150}`}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 text-gray-400"><FiShield className="text-lg" /></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">Buyer Protection</div>
                    <div className="text-xs text-gray-500">{displayProduct.returnPolicy || '7 Days Return'}</div>
                    <div className="text-xs text-gray-500 mt-1">{displayProduct.warranty || 'No Warranty'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {/* Actions Row */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 rounded-xl h-12 border border-gray-200 w-32 shrink-0">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    >-</button>
                    <div className="flex-1 text-center flex items-center justify-center font-bold text-sm">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => setQuantity(q => Math.min(displayProduct.stock || 10, q + 1))}
                      className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    >+</button>
                  </div>

                  {/* Add to Cart */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={displayProduct.stock === 0}
                    className="flex-1 h-12 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <FiShoppingCart className="text-lg" /> Add to Cart
                  </button>

                  {/* Buy Now */}
                  <button 
                    onClick={handleBuyNow}
                    disabled={displayProduct.stock === 0}
                    className="flex-1 h-12 bg-[#ff6a00] hover:bg-[#e65c00] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/30 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleWishlist(displayProduct)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#ff6a00] transition-colors group"
                    >
                      <motion.div animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}>
                        <FiHeart className={`text-lg ${isWishlisted ? 'fill-[#ff6a00] text-[#ff6a00]' : ''}`} />
                      </motion.div>
                      <span>Wishlist</span>
                    </button>
                    
                    <div className="w-px h-4 bg-gray-200"></div>
                    
                    <button 
                      onClick={handleCompare}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#ff6a00] transition-colors"
                    >
                      <FiBarChart2 className="text-lg" />
                      <span>Compare</span>
                    </button>
                    
                    <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                    
                    <button 
                      onClick={() => toast.success('Share link copied!')}
                      className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#ff6a00] transition-colors"
                    >
                      <FiShare2 className="text-lg" />
                      <span>Share</span>
                    </button>
                  </div>

                  <Link 
                    to={`/product/${displayProduct.slug || displayProduct._id}`}
                    onClick={onClose}
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View Full Details <FiChevronRight />
                  </Link>
                </div>
              </div>

            </div>
          </div>
          
          {/* AI Box (Bottom Full Width inside Modal) */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 md:px-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <FiCpu className="text-indigo-400 text-xl" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Vertex AI Assistant</h4>
                <p className="text-gray-400 text-xs">Analyze this product instantly.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors">
                Explain Product
              </button>
              <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors">
                Summarize Reviews
              </button>
              <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors">
                Best Price Check
              </button>
              <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1 shadow-lg shadow-indigo-500/20">
                Ask AI <FiChevronRight />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
