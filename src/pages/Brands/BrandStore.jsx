import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiStar, FiUsers, FiGlobe, FiShield } from 'react-icons/fi';
import brandService from '../../services/brandService';
import ProductCard from '../../components/Products/ProductCard';

const BrandStore = () => {
  const { slug } = useParams();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(false); // Can be linked to user auth state
  
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const data = await brandService.getBrandBySlug(slug);
        setBrandData(data);
      } catch (err) {
        setError('Failed to load brand store');
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [slug]);

  const handleFollow = async () => {
    try {
      if (following) {
        await brandService.unfollowBrand(brandData.id);
        setFollowing(false);
      } else {
        await brandService.followBrand(brandData.id);
        setFollowing(true);
      }
      // Re-fetch to update count or just manually optimistically update
      const newData = await brandService.getBrandBySlug(slug);
      setBrandData(newData);
    } catch (err) {
      console.error(err);
      alert('Please log in to follow brands');
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Brand Store...</div>;
  if (error || !brandData) return <div className="p-10 text-center text-red-500">{error || 'Brand not found'}</div>;

  const { banner, logo, name, description, brandStory, customerRating, followers, verified, website, officialWarranty } = brandData;
  const products = brandData.products || [];

  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Brand Banner */}
      <div 
        className="h-64 md:h-80 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${banner || 'https://via.placeholder.com/1200x400?text=Brand+Banner'})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-100">
          
          {/* Logo */}
          <div className="h-32 w-32 md:h-40 md:w-40 bg-white rounded-2xl shadow-sm border-4 border-white flex items-center justify-center p-2 overflow-hidden flex-shrink-0 -mt-16 md:mt-0">
            <img src={logo || 'https://via.placeholder.com/200?text=Logo'} alt={name} className="max-w-full max-h-full object-contain" />
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2">
              {name}
              {verified && <FiCheckCircle className="text-blue-500 h-6 w-6" />}
            </h1>
            
            <p className="text-gray-600 text-sm md:text-base max-w-2xl">{description}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                <FiStar className="fill-current" /> {customerRating || 0} Rating
              </span>
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                <FiUsers /> {followers ? followers.length : 0} Followers
              </span>
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                  <FiGlobe /> Official Website
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={handleFollow}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${following ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-[#ff6a00] text-white hover:bg-[#e05e00] shadow-lg'}`}
            >
              {following ? 'Following' : 'Follow Brand'}
            </button>
            <div className="text-[10px] text-gray-400 flex items-center gap-1 justify-center">
              <FiShield /> {officialWarranty || 'Official Warranty'}
            </div>
          </div>
        </div>

        {/* Brand Story (if any) */}
        {brandStory && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Our Story</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{brandStory}</p>
          </div>
        )}

        {/* Brand Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Products from {name}</h2>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No products available in this store currently.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandStore;
