import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight, FiCpu, FiMonitor, FiSmartphone, FiSpeaker, FiCamera, FiWatch, FiHeadphones, FiTv, FiUser, FiGrid } from 'react-icons/fi';
import axios from 'axios';

// Map icon strings to actual React Icons
const iconMap = {
  FiSmartphone: <FiSmartphone />,
  FiMonitor: <FiMonitor />,
  FiCpu: <FiCpu />,
  FiTv: <FiTv />,
  FiUser: <FiUser />,
  FiHeadphones: <FiHeadphones />,
  FiSpeaker: <FiSpeaker />,
  FiCamera: <FiCamera />,
  FiWatch: <FiWatch />,
  FiGrid: <FiGrid />
};

const trendingTopics = ["Gaming", "AI Gadgets", "Smart Home", "Photography", "Office Setup"];
const popularBrands = ["Apple", "Samsung", "Sony", "HP", "Dell", "Lenovo", "Nike", "Adidas"];
// topCollections will be dynamic from backend

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, colsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/categories'),
          axios.get('http://localhost:5000/api/v1/collections?featured=true')
        ]);
        
        if (catsRes.data?.success) setCategories(catsRes.data.categories);
        if (colsRes.data?.success) setTopCollections(colsRes.data.collections.slice(0, 4));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search logic
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lower = searchTerm.toLowerCase();
    return categories.filter(cat => 
      cat.name?.toLowerCase().includes(lower) || 
      cat.description?.toLowerCase().includes(lower) ||
      (cat.subCategories && cat.subCategories.some(sub => sub.name?.toLowerCase().includes(lower)))
    );
  }, [categories, searchTerm]);

  const totalProducts = categories.reduce((acc, cat) => acc + (cat.productCount || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 1. Categories Hero & Search */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-20 pb-24 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Marketplace Categories</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Explore thousands of products across all departments. From electronics to fashion, find exactly what you're looking for.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <span className="font-black text-orange-400">{categories.length}+</span> <span className="text-sm font-medium">Departments</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <span className="font-black text-blue-400">{totalProducts.toLocaleString()}+</span> <span className="text-sm font-medium">Products</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hidden sm:block">
              <span className="font-black text-emerald-400">200+</span> <span className="text-sm font-medium">Brands</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="text" 
              placeholder="Search departments, categories, or keywords... (e.g. Laptop)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-900 pl-14 pr-6 py-5 rounded-2xl outline-none focus:ring-4 ring-orange-500/30 text-lg font-medium shadow-2xl transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 space-y-16">
        
        {/* Trending & Brands Bar */}
        {!searchTerm && (
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 flex flex-col lg:flex-row gap-8 border border-gray-100">
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trending Now</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(topic => (
                  <Link key={topic} to={`/products?search=${topic}`} className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-orange-200">
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:block w-px bg-gray-100"></div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Popular Brands</h3>
              <div className="flex flex-wrap gap-2">
                {popularBrands.map(brand => (
                  <Link key={brand} to={`/products?brand=${brand.toLowerCase()}`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid (Shop by Department) */}
        <section>
          <div className="flex items-end justify-between mb-8 mt-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">{searchTerm ? 'Search Results' : 'Shop By Department'}</h2>
              <p className="text-gray-500 mt-2">{searchTerm ? `Showing results for "${searchTerm}"` : 'Browse our complete directory of products.'}</p>
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredCategories.map((cat) => (
                <motion.div 
                  key={cat.id} 
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-orange-500 transition-all duration-300"
                >
                  <Link to={`/products?category=${cat.slug}`} className="flex flex-col h-full">
                    {/* Image Area */}
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors z-10"></div>
                      <img 
                        src={cat.image || "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80"} 
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Icon overlay */}
                      <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-orange-600">
                        {iconMap[cat.icon] || <FiSmartphone />}
                      </div>
                      
                      {cat.featured && (
                        <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">{cat.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{cat.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {cat.productCount ? `${cat.productCount.toLocaleString()} Products` : 'New'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          <FiArrowRight />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm min-h-[400px]">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FiSearch className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-500 max-w-md mb-8">We couldn't find any departments matching "{searchTerm}". Try another keyword or browse all products.</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setSearchTerm('')} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold transition-colors">
                  Clear Search
                </button>
                <Link to="/products" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/30">
                  View All Products
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Top Collections */}
        {!searchTerm && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Top Collections</h2>
              <p className="text-gray-500 mt-1">Curated setups for your lifestyle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCollections.map((col, idx) => (
                <Link key={col.id || idx} to={`/products?collection=${col.slug}`} className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <img src={col.image || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80"} alt={col.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <h4 className="text-white font-bold text-lg">{col.name}</h4>
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all mt-1">
                      Shop Now <FiArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* AI Category Finder */}
        {!searchTerm && (
          <section className="mt-12">
            <div className="bg-gray-900 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 max-w-lg">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                  <FiCpu className="text-indigo-400 text-2xl" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Can't find your category?</h2>
                <p className="text-gray-400 text-lg">
                  Let our AI assistant help you discover the perfect department or recommend exactly what you need based on your preferences.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                <Link to="/products" className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-colors text-center">
                  Browse Products
                </Link>
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
                  <FiCpu /> Ask AI
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Categories;
