import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiFilter, FiX, FiFolder, FiSearch, FiHome, FiGrid, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';
import ProductSkeleton from '../components/common/ProductSkeleton';
import EmptyState from '../components/common/EmptyState';

const CategoryPage = () => {
  const { slug, categorySlug, subSlug, subCategorySlug, brandSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const effectiveSlug = slug || categorySlug;
  const effectiveSubSlug = subSlug || subCategorySlug;
  const effectiveBrand = brandSlug || searchParams.get('brand');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, totalProducts: 0 });

  // Filters State
  const [filters, setFilters] = useState({
    inStock: false,
    maxPrice: '',
    rating: '',
  });

  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // 1. Fetch category details from backend
        const catRes = await axios.get(`http://localhost:5000/api/v1/categories/${effectiveSlug}`);
        if (catRes.data && (catRes.data.data || catRes.data.category)) {
          const fetchedCat = catRes.data.data || catRes.data.category;
          setCategory(fetchedCat);

          // Analytics tracking
          try {
            await axios.post('http://localhost:5000/api/v1/analytics/log', {
              event: 'CATEGORY_VIEW',
              target: fetchedCat.slug || effectiveSlug,
              meta: { name: fetchedCat.name }
            });
          } catch (e) {
            // Silently absorb telemetry network issues
          }
        }
      } catch (err) {
        setCategory(null);
      }

      // Fetch all categories for related section
      try {
        const allCatsRes = await axios.get('http://localhost:5000/api/v1/categories');
        if (allCatsRes.data?.success) {
          setAllCategories(allCatsRes.data.categories);
        }
      } catch (err) {}

      // 2. Fetch category products
      try {
        const query = new URLSearchParams();
        if (sort) query.set('sort', sort);
        if (page) query.set('pageNumber', page);
        if (filters.inStock) query.set('inStock', 'true');
        if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);
        if (filters.rating) query.set('rating', filters.rating);
        if (effectiveBrand && !query.get('brand')) query.set('brand', effectiveBrand);

        let url = `http://localhost:5000/api/v1/categories/${effectiveSlug}/products?${query.toString()}`;
        if (effectiveSubSlug) {
          url = `http://localhost:5000/api/v1/categories/${effectiveSlug}/subcategories/${effectiveSubSlug}?${query.toString()}`;
        } else if (brandSlug) {
          url = `http://localhost:5000/api/v1/categories/${effectiveSlug}/brands/${brandSlug}?${query.toString()}`;
        }

        const prodRes = await axios.get(url);
        if (prodRes.data && prodRes.data.success) {
          setProducts(prodRes.data.products || []);
          setPagination({
            page: prodRes.data.page || 1,
            pages: prodRes.data.pages || 1,
            totalProducts: prodRes.data.totalProducts || (prodRes.data.products ? prodRes.data.products.length : 0)
          });
          if (prodRes.data.category && !category) {
            setCategory(prodRes.data.category);
          }
        }
      } catch (err) {
        setProducts([]);
      }

      // 3. Fetch global featured products for recommendations and empty states
      try {
        const featRes = await axios.get('http://localhost:5000/api/v1/catalog/products/featured');
        if (featRes.data && featRes.data.data) {
          setFeaturedProducts(featRes.data.data.slice(0, 4));
        }
      } catch (err) {
        // Fallback or ignore
      }

      setLoading(false);
    };

    if (effectiveSlug) {
      fetchCategoryData();
    }
  }, [effectiveSlug, effectiveSubSlug, effectiveBrand, sort, page, filters]);

  // Dynamic SEO Generator
  useEffect(() => {
    if (category) {
      const pageTitle = category.seoTitle || `${category.name} | Buy Online at Best Prices - Vertex Market`;
      document.title = pageTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', category.seoDescription || category.description || `Explore ${category.name} products at Vertex Market.`);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', window.location.href);
    }
  }, [category]);

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: key === 'inStock' ? false : '' }));
  };

  const resetFilters = () => {
    setFilters({ inStock: false, maxPrice: '', rating: '' });
  };

  const currentSubCategory = useMemo(() => {
    if (!category || !effectiveSubSlug || !category.subCategories) return null;
    return category.subCategories.find(s => s.slug === effectiveSubSlug || s.slug.toLowerCase() === effectiveSubSlug.toLowerCase());
  }, [category, effectiveSubSlug]);

  const displayedProducts = useMemo(() => {
    return products;
  }, [products]);

  // ERROR HANDLING: If category does NOT exist at all (No 404 page, professional fallback inside layout)
  if (!loading && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <FiChevronRight className="mx-2" />
          <Link to="/categories" className="hover:text-orange-600 transition-colors">Categories</Link>
          <FiChevronRight className="mx-2" />
          <span className="text-gray-900 font-medium">Category Not Found</span>
        </nav>

        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm my-8">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
            <FiFolder size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
            We couldn't find the department "{effectiveSlug}". It may have been moved or combined into our expanded enterprise catalog.
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text"
                placeholder="Search all products or keywords..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    navigate(`/products?search=${encodeURIComponent(e.target.value)}`);
                  }
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/categories" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-600/30 flex items-center gap-2">
              <FiGrid /> Browse All Categories
            </Link>
            <Link to="/" className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors flex items-center gap-2">
              <FiHome /> Home
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-lg font-black text-gray-900 mb-6 text-left">Featured Departments</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-left">
              {allCategories.slice(0, 6).map((cat) => (
                <Link key={cat.slug || cat.id} to={`/categories/${cat.slug}`} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-all group">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition-colors truncate">{cat.name}</h4>
                  <span className="text-xs text-gray-500 mt-1 block">{cat.productCount || 0} items</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
        <FiChevronRight className="mx-2" />
        <Link to="/categories" className="hover:text-orange-600 transition-colors">Categories</Link>
        <FiChevronRight className="mx-2" />
        {currentSubCategory ? (
          <>
            <Link to={`/categories/${category.slug}`} className="hover:text-orange-600 transition-colors">{category.name}</Link>
            <FiChevronRight className="mx-2" />
            <span className="text-gray-900 font-medium">{currentSubCategory.name}</span>
          </>
        ) : (
          <span className="text-gray-900 font-medium">{category?.name || 'Loading...'}</span>
        )}
      </nav>

      {/* Category Banner & Header (Reusing existing layout design) */}
      {category && (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 md:p-12 mb-8 shadow-xl">
          {category.image && (
            <img 
              src={category.image} 
              alt={category.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-25 object-right pointer-events-none"
            />
          )}
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
              Verified Marketplace Category
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
              {currentSubCategory ? currentSubCategory.name : category.name}
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {category.description || `Browse the latest collection of premium ${category.name} with official brand warranty and fast delivery.`}
            </p>
          </div>
        </div>
      )}

      {/* Subcategory Pills */}
      {category && category.subCategories && category.subCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <Link
            to={`/categories/${category.slug}`}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
              !effectiveSubSlug ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-500'
            }`}
          >
            All {category.name}
          </Link>
          {category.subCategories.map((sub) => (
            <Link
              key={sub.slug || sub.id}
              to={`/categories/${category.slug}/${sub.slug}`}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
                effectiveSubSlug === sub.slug ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-500'
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Sort & Filter Bar (Reusing exact Products.jsx filter layout) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors shrink-0">
            <FiFilter /> Filters
          </button>
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          >
            <option value="">Any Price</option>
            <option value="50000">Under Rs 50,000</option>
            <option value="150000">Under Rs 1,50,000</option>
            <option value="300000">Under Rs 3,00,000</option>
          </select>
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0"
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0"
            value={filters.inStock ? "true" : "false"}
            onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.value === "true" }))}
          >
            <option value="false">All Items</option>
            <option value="true">In Stock Only</option>
          </select>
        </div>

        <div className="w-full md:w-auto flex justify-end shrink-0">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500 w-full md:w-auto"
            value={searchParams.get('sort') || 'newest'}
            onChange={(e) => {
              searchParams.set('sort', e.target.value);
              setSearchParams(searchParams);
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popularity">Top Rated / Popular</option>
          </select>
        </div>
      </div>

      {/* Active Filters & Product Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.inStock && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
              In Stock <button onClick={() => removeFilter('inStock')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold">
              Max Price: Rs {Number(filters.maxPrice).toLocaleString()} <button onClick={() => removeFilter('maxPrice')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {filters.rating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
              {filters.rating}+ Stars <button onClick={() => removeFilter('rating')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {(filters.inStock || filters.maxPrice || filters.rating) && (
            <button onClick={resetFilters} className="text-xs text-gray-500 underline ml-2 font-medium hover:text-gray-800">
              Clear All
            </button>
          )}
        </div>
        <div className="text-sm font-bold text-gray-500 shrink-0">
          Showing {loading ? '...' : displayedProducts.length} {pagination.totalProducts ? `of ${pagination.totalProducts}` : ''} Products
        </div>
      </div>

      {/* Products Grid & Empty State */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </motion.div>
        ) : displayedProducts.length > 0 ? (
          <>
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id || product._id} {...product} />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => {
                    searchParams.set('page', pagination.page - 1);
                    setSearchParams(searchParams);
                  }}
                  className="p-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-orange-500 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <FiArrowLeft />
                </button>
                <span className="px-5 py-2.5 bg-gray-50 rounded-xl font-bold text-sm text-gray-800 border border-gray-200">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => {
                    searchParams.set('page', pagination.page + 1);
                    setSearchParams(searchParams);
                  }}
                  className="p-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-orange-500 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <FiArrowRight />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State as mandated: Do NOT show a 404 page. Show Empty State component + Popular/Featured products + Related Categories */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full space-y-12 my-6"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <EmptyState 
                title="No products available right now"
                description={`We couldn't find any active products listed under ${currentSubCategory ? currentSubCategory.name : category?.name || 'this category'} right now. Our inventory is constantly updated daily.`}
                actionText="Continue Shopping"
                actionLink="/products"
                illustration="search"
              />
            </div>

            {/* Popular & Featured Products Section on Empty State */}
            {featuredProducts.length > 0 && (
              <div className="border-t border-gray-200/60 pt-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-gray-900">Featured & Popular Products</h3>
                  <Link to="/products" className="text-sm font-bold text-orange-600 hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {featuredProducts.map(prod => (
                    <ProductCard key={prod.id || prod._id} {...prod} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Categories Section */}
      <section className="mt-16 border-t border-gray-200/60 pt-10">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-gray-900">Related Categories & Departments</h3>
          <p className="text-gray-500 text-sm">Explore popular alternative departments across Vertex Market.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allCategories
            .filter(c => c.slug !== effectiveSlug)
            .slice(0, 6)
            .map((cat) => (
              <Link
                key={cat.slug || cat.id}
                to={`/categories/${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-orange-500 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-lg mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  {cat.name.charAt(0)}
                </div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1">{cat.name}</h4>
                <span className="text-xs text-gray-400 mt-1">{cat.productCount ? `${cat.productCount} Products` : 'Explore'}</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
