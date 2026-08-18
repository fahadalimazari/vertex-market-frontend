import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import brandService from '../../services/brandService';
import productService from '../../services/productService';
import ProductCard from '../../components/Products/ProductCard';
import { FiStar, FiUsers, FiPackage, FiGrid, FiSliders, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BrandDetailPage = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular'); // popular, latest, priceAsc, priceDesc
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandRes = await brandService.getBrandBySlug(slug);
        setBrand(brandRes);
        
        if (brandRes) {
          if (brandRes.products && Array.isArray(brandRes.products)) {
            setProducts(brandRes.products);
          } else {
            const prodsRes = await productService.getProducts({ brand: brandRes.name || slug, status: 'active' });
            const list = Array.isArray(prodsRes) ? prodsRes : (prodsRes.data || prodsRes.products || []);
            setProducts(list);
          }
        }
      } catch (err) {
        console.error('Failed to load brand store', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
    toast.success(isFollowing ? 'Unfollowed brand store' : 'Following brand store! You will get updates.');
  };

  // Filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Price
    result = result.filter(p => p.price <= maxPrice);

    // Filter by Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, maxPrice, minRating, sortBy]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-8">
        <div className="h-64 bg-gray-50 border border-gray-150 rounded-3xl" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-96 bg-gray-50 rounded-3xl" />
          <div className="col-span-3 grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-50 rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-900">Brand Store Not Found</h2>
        <Link to="/" className="text-[#ff6a00] hover:underline text-xs mt-2 inline-block">Return to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Brand Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] sm:aspect-[16/5] bg-gray-900 border border-gray-150 shadow-sm">
        <img src={brand.banner} alt={`${brand.name} Banner`} className="w-full h-full object-cover opacity-80" />
        
        {/* Brand identity overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex items-end p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 text-white">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white p-2 border border-white/20 shadow-lg flex-shrink-0 flex items-center justify-center">
                <img src={brand.logo} alt={`${brand.name} Logo`} className="max-h-full max-w-full object-contain rounded-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black">{brand.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] md:text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-0.5 text-orange-500">
                    <FiStar className="h-3.5 w-3.5 fill-orange-500" /> {brand.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <FiUsers className="h-3.5 w-3.5" /> 
                    {((brand.followers + (isFollowing ? 1 : 0)) / 1000).toFixed(1)}k followers
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <FiPackage className="h-3.5 w-3.5" /> {products.length} products
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {brand.couponCode && (
                <div className="bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold">
                  <FiGift className="text-orange-500" />
                  <span>Use Code: {brand.couponCode}</span>
                </div>
              )}
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                    : 'bg-[#ff6a00] text-white hover:bg-[#e05e00]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Store'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Narrative Story */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-2">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Brand Story</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{brand.story}</p>
      </div>

      {/* Store layout: filters + products grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm space-y-6 h-fit">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2.5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <FiSliders className="text-[#ff6a00]" /> Filters
            </h3>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMaxPrice(300000);
                setMinRating(0);
              }}
              className="text-[10px] font-bold text-gray-400 hover:text-[#ff6a00]"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Category</span>
            <div className="space-y-1.5">
              {['all', ...brand.categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-50 text-[#ff6a00]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'all' ? 'All categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Max Price (Rs. {maxPrice.toLocaleString()})
            </span>
            <input
              type="range"
              min="1000"
              max="300000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#ff6a00]"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Minimum Rating</span>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map(stars => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                    minRating === stars
                      ? 'bg-orange-50 border-[#ff6a00]/30 text-[#ff6a00]'
                      : 'bg-white border-gray-150 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {stars === 0 ? 'All' : `★${stars}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-gray-500">
              Showing {processedProducts.length} results
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#ff6a00] bg-white text-gray-700"
              >
                <option value="popular">Popularity</option>
                <option value="latest">New Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {processedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {processedProducts.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center text-gray-400 text-xs">
              No products match selected filters in this brand store.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BrandDetailPage;
