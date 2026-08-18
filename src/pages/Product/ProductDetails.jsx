import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiShoppingCart, FiHeart, FiShare2, FiStar, FiChevronRight, 
  FiShield, FiTruck, FiBox, FiMessageSquare, FiInfo, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/Products/ProductCard';

// Dynamic Specification Components
const SpecificationRow = ({ name, value }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0 text-sm">
    <div className="font-bold text-gray-700">{name}</div>
    <div className="col-span-2 text-gray-600">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</div>
  </div>
);

const SpecificationSection = ({ title, specs }) => (
  <div className="mb-8">
    <h4 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">{title}</h4>
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      {specs.map((spec, i) => (
        <SpecificationRow key={i} name={spec.name} value={spec.value} />
      ))}
    </div>
  </div>
);

const SpecificationRenderer = ({ specifications }) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center italic">No specifications available.</p>;
  }
  
  return (
    <div className="space-y-2">
      {Object.entries(specifications).map(([group, specs]) => (
        <SpecificationSection key={group} title={group} specs={specs} />
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await productService.getProductBySlug(slug);
        if (res.success) {
          setProductData(res.data);
        }
      } catch (error) {
        toast.error('Product not found');
      } finally {
        setIsLoading(false);
        // Scroll to top
        window.scrollTo(0,0);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff6a00] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen text-center">
        <h2 className="text-2xl font-black text-gray-900">Product Not Found</h2>
        <Link to="/" className="text-[#ff6a00] font-bold mt-4 inline-block hover:underline">Return Home</Link>
      </div>
    );
  }

  const { 
    name, price, oldPrice, discount, stock, image, gallery, 
    shortDescription, longDescription, brand, rating, reviews,
    categoryData, subCategoryData, sellerId, highlights, specifications,
    relatedProducts
  } = productData;

  const images = gallery?.length > 0 ? gallery : [image];
  const isWished = isInWishlist(productData._id || productData.id);

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center text-xs text-gray-500 mb-6 gap-2">
          <Link to="/" className="hover:text-[#ff6a00] font-bold">Home</Link>
          <FiChevronRight />
          <Link to={`/category/${categoryData?.slug || ''}`} className="hover:text-[#ff6a00] font-bold">{categoryData?.name}</Link>
          <FiChevronRight />
          <Link to={`/category/${categoryData?.slug}/${subCategoryData?.slug}`} className="hover:text-[#ff6a00] font-bold">{subCategoryData?.name}</Link>
          <FiChevronRight />
          <span className="text-gray-900 font-bold truncate max-w-xs">{name}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Gallery (Left) */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative group cursor-zoom-in flex items-center justify-center p-8">
                <img 
                  src={images[activeImage]} 
                  alt={name} 
                  className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-500"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-red-500/30 z-10">
                    -{discount}% OFF
                  </div>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all p-2 bg-gray-50 ${activeImage === idx ? 'border-[#ff6a00]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info (Right) */}
            <div className="p-8 lg:p-10 flex flex-col h-full">
              <div className="mb-2">
                <span className="text-sm font-black text-gray-500 tracking-wider uppercase">{brand || categoryData?.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">{name}</h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center text-amber-400 gap-1">
                  <FiStar className="fill-current" />
                  <span className="font-bold text-gray-900">{rating ? Number(rating).toFixed(1) : '0.0'}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 hover:text-[#ff6a00] cursor-pointer transition-colors">{reviews || '128'} Reviews</span>
                <span className="text-gray-300">|</span>
                <span className={`font-bold flex items-center gap-1.5 ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {stock > 0 ? <FiCheck /> : <FiInfo />}
                  {stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mb-6 flex items-end gap-3">
                <div className="text-4xl font-black text-[#ff6a00]">Rs. {Number(price).toLocaleString()}</div>
                {oldPrice && (
                  <div className="text-lg text-gray-400 line-through font-bold mb-1">Rs. {Number(oldPrice).toLocaleString()}</div>
                )}
              </div>

              {shortDescription && (
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {shortDescription}
                </p>
              )}

              {/* Dynamic Highlights */}
              {highlights && highlights.length > 0 && (
                <div className="mb-8 grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="font-bold text-gray-700">{h.name}:</span>
                      <span className="text-gray-600 truncate">{h.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Variant Placeholder */}
              <div className="mb-8 space-y-4">
                 {/* Reserved for Phase 6 Variants (Choose Color, Size, etc) */}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-auto">
                <button 
                  onClick={() => addToCart(productData, 1)}
                  disabled={stock === 0}
                  className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="text-xl" /> Add to Cart
                </button>
                <button 
                  disabled={stock === 0}
                  className="flex-1 bg-[#ff6a00] hover:bg-[#e05e00] text-white py-4 rounded-xl font-black flex items-center justify-center transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => toggleWishlist(productData)}
                  className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl text-xl transition-all ${isWished ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <FiHeart className={isWished ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Services */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs font-bold text-gray-600">
                <div className="flex items-center gap-2"><FiTruck className="text-xl text-[#ff6a00]" /> Fast Delivery</div>
                <div className="flex items-center gap-2"><FiShield className="text-xl text-green-500" /> Buyer Protection</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Tabs (Left 3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {['description', 'specifications', 'shipping', 'warranty', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[120px] py-5 px-6 font-black text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? 'border-[#ff6a00] text-[#ff6a00] bg-orange-50/30' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-8">
                {activeTab === 'description' && (
                  <div className="prose max-w-none text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: longDescription || shortDescription }} />
                )}
                {activeTab === 'specifications' && (
                  <SpecificationRenderer specifications={specifications} />
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-4 text-sm text-gray-600">
                    <p><strong>Shipping Time:</strong> 3-5 Business Days</p>
                    <p><strong>Delivery Regions:</strong> Nationwide</p>
                    <p>Orders are shipped securely. You will receive a tracking link via email once your order has been dispatched.</p>
                  </div>
                )}
                {activeTab === 'warranty' && (
                  <div className="space-y-4 text-sm text-gray-600">
                    {specifications?.Warranty ? (
                      <div>
                         <p className="mb-4"><strong>Covered Under Warranty:</strong></p>
                         <ul className="list-disc pl-5 mt-2 space-y-2">
                            {specifications.Warranty.map((w, i) => <li key={i}>{w.name}: {w.value}</li>)}
                         </ul>
                      </div>
                    ) : (
                      <p>No warranty information specified for this product.</p>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="py-8 text-center text-gray-500">
                    <FiMessageSquare className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p className="font-bold text-gray-900 mb-1">Customer Reviews</p>
                    <p className="text-xs">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900">Related Products</h3>
                  <Link to={`/category/${categoryData?.slug}`} className="text-sm font-bold text-[#ff6a00] hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map(prod => (
                     <ProductCard key={prod._id} product={{...prod, id: prod._id}} />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar (Right 1 col) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Seller Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                  {sellerId?.logo ? <img src={sellerId.logo} alt={sellerId.storeName} className="w-full h-full object-cover"/> : <FiBox className="text-2xl text-gray-400"/>}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm flex items-center gap-1">
                    {sellerId?.storeName || 'Official Store'}
                    {sellerId?.isOfficial && <FiCheck className="text-white bg-blue-500 rounded-full p-0.5 text-[10px]" title="Official Store"/>}
                  </h4>
                  <div className="flex items-center text-amber-400 gap-1 text-xs mt-1">
                    <FiStar className="fill-current" />
                    <span className="font-bold text-gray-700">{sellerId?.rating ? Number(sellerId.rating).toFixed(1) : '0.0'}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs mb-4">
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div className="font-black text-gray-900">{sellerId?.followers || '1.2K'}</div>
                  <div className="text-gray-500 text-[10px] uppercase">Followers</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div className="font-black text-gray-900">{sellerId?.responseTime || '98%'}</div>
                  <div className="text-gray-500 text-[10px] uppercase">Response</div>
                </div>
              </div>
              <button className="w-full py-2.5 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:border-gray-900 hover:text-gray-900 transition-colors">
                Visit Store
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
