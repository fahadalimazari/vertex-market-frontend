import { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../../components/common/ProductCard';
import ProductSkeleton from '../../components/common/ProductSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { getValidDeals } from '../../utils/dealCalculations';

const Products = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  
  // Example filters state
  const [filters, setFilters] = useState({
    category: 'All Categories',
    inStock: true,
    isFeatured: false,
    isFlashSale: false,
    isTodaysDeals: false,
  });

  useEffect(() => {
    // 2. Scroll Position
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle routing state from Hero
    if (location.state) {
      const { filter, aiContext } = location.state;
      if (filter === 'featured') {
        setFilters(prev => ({ ...prev, isFeatured: true }));
      } else if (filter === 'flash-sale') {
        setFilters(prev => ({ ...prev, isFlashSale: true }));
      }
      // AI Context logic would dispatch here if implemented via context
    } else {
      // Basic query param support for direct URL navigation
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('filter') === 'flash-sale') {
        setFilters(prev => ({ ...prev, isFlashSale: true }));
      }
      if (searchParams.get('filter') === 'todays-deals') {
        setFilters(prev => ({ ...prev, isTodaysDeals: true }));
      }
      if (searchParams.get('category')) {
        setFilters(prev => ({ ...prev, category: searchParams.get('category') }));
      }
    }
  }, [location]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      // Build API query from searchParams and filters
      const query = new URLSearchParams();
      if (filters.category && filters.category !== 'All Categories') {
        query.set('categorySlug', filters.category.toLowerCase().replace(/\s+/g, '-'));
      }
      if (searchParams.get('sort')) query.set('sort', searchParams.get('sort'));
      if (searchParams.get('page')) query.set('page', searchParams.get('page'));
      
      const { data } = await axios.get(`http://127.0.0.1:5000/api/v1/catalog/products?${query.toString()}`);
      if (data.success) {
        // If todays-deals is active, apply client-side deal calculation
        if (filters.isTodaysDeals) {
          const validDeals = getValidDeals(data.data.products);
          setProducts(validDeals);
        } else {
          setProducts(data.data.products);
        }
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load catalog', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [filters.category, filters.isTodaysDeals, searchParams]);

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: false }));
    setLoading(true);
  };

  const resetFilters = () => {
    setFilters({
      category: 'All Categories',
      inStock: true,
      isFeatured: false,
      isFlashSale: false,
      isTodaysDeals: false,
    });
    setLoading(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 7. Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
        <FiChevronRight className="mx-2" />
        <span className="text-gray-900 font-medium">Products</span>
      </nav>

      {/* 8. Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Explore Products</h1>
        <p className="text-gray-500">Find the latest products from trusted brands.</p>
      </div>

      {/* 9. Sort & Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors shrink-0">
            <FiFilter /> Filters
          </button>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0">
            <option>Category</option>
            <option>Laptops</option>
            <option>Smartphones</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0">
            <option>Brand</option>
            <option>Apple</option>
            <option>Samsung</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0">
            <option>Price</option>
            <option>Under $500</option>
            <option>$500 - $1000</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0">
            <option>Rating</option>
            <option>4+ Stars</option>
            <option>3+ Stars</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 shrink-0">
            <option>Availability</option>
            <option>In Stock</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto flex justify-end shrink-0">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500 w-full md:w-auto"
            value={searchParams.get('sort') || 'featured'}
            onChange={(e) => {
              searchParams.set('sort', e.target.value);
              setSearchParams(searchParams);
            }}
          >
            <option value="featured">Sort By: Featured</option>
            <option value="newest">Newest Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="highestRated">Top Rated</option>
          </select>
        </div>
      </div>

      {/* 4. Active Filters & 3. Product Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.isFeatured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold">
              Featured <button onClick={() => removeFilter('isFeatured')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {filters.isFlashSale && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
              Flash Sale <button onClick={() => removeFilter('isFlashSale')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {filters.isTodaysDeals && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold">
              Today's Deals <button onClick={() => removeFilter('isTodaysDeals')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {filters.inStock && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
              In Stock <button onClick={() => removeFilter('inStock')}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-bold">
              {filters.category} <button onClick={() => setFilters(prev => ({...prev, category: null}))}><FiX className="hover:text-red-500" /></button>
            </span>
          )}
        </div>
        <div className="text-sm font-bold text-gray-500 shrink-0">
          Showing {loading ? '...' : products.length} {pagination && `of ${pagination.total}`} Products
        </div>
      </div>

      {/* 5. Products Grid & 13. Empty State */}
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
        ) : products.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full"
          >
            <EmptyState 
              title="No Products Found"
              description="Try clearing your filters or explore other categories to find what you're looking for."
              actionText="Clear Filters"
              actionLink={null}
              illustration="search"
            />
            {/* Using a custom button here since actionLink=null in the component doesn't render the button */}
            <div className="flex justify-center -mt-4 mb-8">
              <button 
                onClick={resetFilters}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-orange-600/30"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Products;
