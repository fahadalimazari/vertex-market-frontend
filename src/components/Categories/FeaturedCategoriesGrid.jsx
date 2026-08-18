import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMonitor, FiSmartphone, FiSpeaker, FiCamera, FiWatch, FiHeadphones, FiCpu, FiTv, FiUser, FiGrid } from 'react-icons/fi';
import axios from 'axios';
import EmptyState from '../common/EmptyState';

// Map icon strings from data to actual React Icons
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

const FeaturedCategoriesGrid = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('https://vertex-market-backend.vercel.app/api/v1/categories?featured=true', {
          params: { _t: Date.now() },
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setFeaturedCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching featured categories:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Explore our premium selection of top categories.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-[160px] rounded-2xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredCategories.length === 0) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Explore our premium selection of top categories.</p>
          </div>
        </div>
        <EmptyState 
          title="No Featured Categories" 
          description="We couldn't find any active featured categories on the homepage right now." 
          actionLink="/categories" 
          actionText="Browse All Categories" 
          illustration="box" 
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Explore our premium selection of top categories.</p>
        </div>
        <Link to="/categories" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
          View All
        </Link>
      </div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {featuredCategories.map((cat) => (
          <motion.div key={cat._id || cat.categoryId} variants={itemVariants} className="h-full">
            <Link 
              to={`/categories/${cat.slug}`}
              className="group relative flex flex-col h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow bg-gray-900"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.img 
                  src={cat.image || "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80"} 
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-80"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10 pointer-events-none"></div>

              {/* Content */}
              <div className="relative z-20 flex flex-col justify-end p-3 sm:p-5 h-full min-h-[140px] sm:min-h-[160px]">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xl mb-3 group-hover:-translate-y-1 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                  {iconMap[cat.icon] || <FiGrid />}
                </div>
                
                {/* Text Info */}
                <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-1 group-hover:text-orange-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-300 font-medium">
                  {cat.productCount !== undefined && cat.productCount !== null ? `${cat.productCount.toLocaleString()}+ Products` : 'Explore'}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedCategoriesGrid;
