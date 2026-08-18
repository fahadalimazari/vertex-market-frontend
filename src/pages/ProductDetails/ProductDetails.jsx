import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import toast from 'react-hot-toast';
import { FiInfo, FiStar, FiCheckCircle } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

// Components
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import PurchaseBox from './components/PurchaseBox';
import StickyBar from './components/StickyBar';
import ReviewsSection from './components/ReviewsSection';
import QASection from './components/QASection';
import { RecommendationSection } from './components/Recommendations';
import DiscoverMore from './components/DiscoverMore';
import FrequentlyBoughtTogether from './components/FrequentlyBoughtTogether';

const getDisplayName = (field) => {
  if (!field) return null;
  if (typeof field === 'object') return field.name || '';
  return String(field);
};

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${slug}`);
        const p = res.data.data;
        setProduct(p);
        setActiveImage(p.image);
        
        if (Array.isArray(p.variants) && p.variants.length > 0) {
          setSelectedAttributes(p.variants[0].attributes || {});
          if (Array.isArray(p.variants[0].images) && p.variants[0].images.length > 0) {
            setActiveImage(p.variants[0].images[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  const currentVariant = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants) || product.variants.length === 0) return null;
    return product.variants.find(v => {
      if (!v.attributes) return false;
      return Object.entries(selectedAttributes).every(([key, value]) => v.attributes[key] === value);
    }) || product.variants[0];
  }, [product, selectedAttributes]);

  useEffect(() => {
    if (currentVariant?.images && Array.isArray(currentVariant.images) && currentVariant.images.length > 0) {
      setActiveImage(currentVariant.images[0]);
    }
  }, [currentVariant]);

  const availableAttributes = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return {};
    const attrs = {};
    product.variants.forEach(variant => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) attrs[key] = new Set();
          attrs[key].add(value);
        });
      }
    });
    return attrs;
  }, [product]);

  const handleAttributeSelect = (key, value) => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
          <FiInfo className="text-3xl" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <Link to="/" className="px-5 py-2.5 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition-colors">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.slug || product._id);
  const gallery = [...new Set([product.image, ...(product.gallery || []), ...(product.images?.map(i => i.imageUrl) || [])])].filter(Boolean);
  
  const currentPrice = currentVariant?.price || product.price;
  const oldPrice = product.comparePrice || product.oldPrice;
  const currentStock = currentVariant?.stock !== undefined ? currentVariant.stock : product.stock;
  const discountPercentage = oldPrice > currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : product.discountValue || 0;

  const handleAddToCart = () => {
    addToCart({ 
      ...product, 
      price: currentPrice, 
      stock: currentStock, 
      quantity, 
      selectedVariant: currentVariant,
      selectedAttributes
    });
    toast.success(`${getDisplayName(product.name)} added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const joinDate = product.seller?.createdAt ? new Date(product.seller.createdAt).getFullYear() : '2023';

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 lg:pb-16 pt-4">
      <StickyBar 
        product={product} 
        currentPrice={currentPrice} 
        activeImage={activeImage}
        currentStock={currentStock} 
        quantity={quantity}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap uppercase tracking-wider">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link> 
          <span>/</span>
          <span className="text-gray-800 truncate max-w-[150px] sm:max-w-md">{getDisplayName(product.name)}</span>
        </div>

        {/* 1. Core Product Area */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8">
          <div className="w-full lg:w-[45%] xl:w-1/2">
            <ProductGallery 
              product={product} 
              activeImage={activeImage} 
              setActiveImage={setActiveImage} 
              gallery={gallery} 
              discountPercentage={discountPercentage} 
            />
          </div>

          <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col">
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm mb-4">
              
              <ProductInfo product={product} currentVariant={currentVariant} currentStock={currentStock} />

              {/* Dynamic Variants Selector */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="space-y-4 mb-6 pt-6 border-t border-gray-100">
                  {Object.entries(availableAttributes).map(([attrKey, attrSet]) => (
                    <div key={attrKey}>
                      <div className="flex justify-between items-end mb-2">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">{attrKey}</h3>
                        <span className="text-xs font-bold text-orange-600">{selectedAttributes[attrKey]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(attrSet).map(val => {
                          const isSelected = selectedAttributes[attrKey] === val;
                          return (
                            <button 
                              key={val}
                              onClick={() => handleAttributeSelect(attrKey, val)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border-2
                                ${isSelected 
                                  ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00] shadow-sm' 
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <PurchaseBox 
                product={product} 
                currentPrice={currentPrice}
                oldPrice={oldPrice}
                currentStock={currentStock}
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCart={handleAddToCart}
                handleBuyNow={handleBuyNow}
                toggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
                addToCompare={addToCompare}
              />
            </div>
            
            {/* Delivery/Warranty Box */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-sm font-medium text-gray-700 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-gray-500">Delivery</span>
                <span className="font-bold">{product.estimatedDelivery || 'Typically 3-5 Business Days'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-green-600">{product.shippingFee === 0 || product.freeShipping ? 'Free Shipping' : `Rs. ${product.shippingFee}`}</span>
              </div>
              {product.returnPolicy && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-gray-500">Returns</span>
                  <span className="font-bold">{product.returnPolicy}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Warranty</span>
                  <span className="font-bold">{product.warranty}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Product Description */}
        <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-6">Product Description</h2>
          
          {product.highlights?.length > 0 && (
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.highlights.map((h, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-gray-700 items-start">
                  <FiCheckCircle className="text-green-500 text-lg shrink-0 mt-0.5" />
                  <span className="font-bold">{h.value || h}</span>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-sm md:prose-base max-w-none text-gray-600 font-medium">
            {product.longDescription ? (
              <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
            ) : (
              <p>{product.shortDescription || 'No description provided.'}</p>
            )}
          </div>
        </div>

        {/* 3. Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-sm mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {product.specifications.map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{group.section || 'General'}</h3>
                  <div className="space-y-3">
                    {group.specs && group.specs.map((spec, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                        <span className="text-gray-500 font-bold">{spec.name}</span>
                        <span className="text-gray-900 font-medium text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Customer Reviews */}
        <ReviewsSection product={product} />

        {/* 5. Questions & Answers */}
        <QASection product={product} />

        {/* 6. Frequently Bought Together */}
        <FrequentlyBoughtTogether product={product} />
        
        {/* 7. Related Products */}
        <RecommendationSection endpoint="/api/products/recommendations/related" title="Related Products" params={{ category: product.category, subCategory: product.subCategory, currentProductId: product._id }} />
        
        {/* 8. More from this seller */}
        {product.sellerId && (
          <div className="mb-6 mt-12 bg-gray-900 text-white rounded-3xl p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-gray-300 shadow-sm overflow-hidden shrink-0 text-gray-800">
                {product.seller?.logo ? <img src={product.seller.logo} className="w-full h-full object-cover" alt="Seller" /> : getDisplayName(product.seller).charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sold By</div>
                <div className="text-xl font-black flex items-center gap-2 mb-1">
                  {getDisplayName(product.seller)}
                  {product.seller?.isOfficial && <MdVerified className="text-blue-500" title="Official Store" />}
                </div>
                <div className="text-xs font-bold text-gray-300 flex gap-3">
                  <span className="flex items-center gap-1"><FiStar className="text-yellow-400 fill-current" /> {product.seller?.rating ? Number(product.seller.rating).toFixed(1) : '0.0'}</span>
                  <span>{product.seller?.followers || '5K+'} Followers</span>
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link to={`/seller/${product.seller?.slug || product.seller?._id}`} className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 text-center font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors">
                Visit Store
              </Link>
            </div>
          </div>
        )}
        {product.sellerId && (
          <RecommendationSection endpoint={`/api/products/recommendations/seller/${product.sellerId?._id || product.sellerId}`} title="More from this Seller" params={{ currentProductId: product._id }} />
        )}

        {/* 9. Discover More Products (Tabbed Secondary Recommendations) */}
        <DiscoverMore currentProductId={product._id} category={product.category} subCategory={product.subCategory} />

        {/* 10. Recently Viewed */}
        <RecommendationSection endpoint="/api/products/recommendations/recently-viewed" title="Recently Viewed" />

      </div>
    </div>
  );
};

export default ProductDetails;
