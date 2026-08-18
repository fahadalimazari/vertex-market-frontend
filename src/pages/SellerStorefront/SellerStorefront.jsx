import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiUser, FiCalendar, FiBox, FiCheckCircle, FiHeart } from 'react-icons/fi';
import ProductCard from '../../components/Products/ProductCard';
import SellerBadge from '../../components/common/SellerBadge';
import { useAuth } from '../../context/AuthContext'; // Assume we have auth context to check if logged in
import { sessionService } from '../../services/auth/sessionService';

const SellerStorefront = () => {
  const { sellerSlug } = useParams();
  const { user } = useAuth(); // To check if user is logged in
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);



  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const [profileRes, productsRes] = await Promise.all([
          axios.get(`https://vertex-market-backend.vercel.app/api/v1/seller/store/${sellerSlug}`),
          axios.get(`https://vertex-market-backend.vercel.app/api/v1/seller/store/${sellerSlug}/products`)
        ]);

        if (profileRes.data.success) {
          setSeller(profileRes.data.data);
        }
        if (productsRes.data.success) {
          setProducts(productsRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Store not found');
      } finally {
        setLoading(false);
      }
    };

    if (sellerSlug) {
      fetchStoreData();
    }
  }, [sellerSlug]);

  const handleFollowToggle = async () => {
    if (!user) {
      alert("Please login to follow stores");
      return;
    }
    try {
      setFollowLoading(true);
      const res = await axios.post(
        `https://vertex-market-backend.vercel.app/api/v1/seller/store/${seller._id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${sessionService.getSession()?.token}` } }
      );
      if (res.data.success) {
        setIsFollowing(res.data.following);
        setSeller(prev => ({ ...prev, followers: res.data.followers }));
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert(err.response?.data?.message || "Failed to follow store");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6a00] border-t-transparent" />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <FiBox className="text-4xl text-gray-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Store Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          The store you are looking for does not exist, has been suspended, or is currently unavailable.
        </p>
        <Link to="/" className="px-8 py-3 bg-[#ff6a00] text-white font-bold rounded-xl hover:bg-[#e05e00] transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Store Header Banner */}
      <div className="h-48 md:h-64 bg-gray-900 relative overflow-hidden">
        {seller.banner ? (
          <img src={seller.banner} alt="Store Banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Store Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl flex items-center justify-center font-black text-5xl text-gray-300 shadow-sm overflow-hidden shrink-0 border-4 border-white text-gray-800 bg-gray-50">
            {seller.logo ? (
              <img src={seller.logo} className="w-full h-full object-cover" alt={seller.name} />
            ) : (
              seller.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-4 w-full">
            <div className="flex flex-col w-full md:w-auto md:flex-row md:items-center gap-4 mb-4 justify-between">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight truncate max-w-full">
                  {seller.name}
                </h1>
                {seller.badges && seller.badges.length > 0 && (
                  <SellerBadge badgeType={seller.badges[0].type} size="md" />
                )}
              </div>
              <button 
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-2 rounded-xl font-bold transition-all ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-[#ff6a00] text-white hover:bg-[#e05e00] shadow-md hover:shadow-lg'
                }`}
              >
                <FiHeart className={isFollowing ? 'fill-current text-red-500' : ''} />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            
            {seller.description && (
              <p className="text-gray-500 mb-6 max-w-2xl mx-auto md:mx-0 text-sm md:text-base leading-relaxed">
                {seller.description}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 md:gap-8 text-sm font-bold text-gray-600 bg-gray-50 rounded-2xl p-4 w-full md:w-max mx-auto md:mx-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <FiStar className="text-yellow-500 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">Rating</div>
                  <div className="text-gray-900 truncate">{seller.rating}</div>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <FiUser className="text-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">Followers</div>
                  <div className="text-gray-900 truncate">{seller.followers}</div>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <FiCalendar className="text-green-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">Joined</div>
                  <div className="text-gray-900 truncate">{new Date(seller.joinedAt).getFullYear()}</div>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <FiBox className="text-purple-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">Products</div>
                  <div className="text-gray-900 truncate">{products.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Store Products</h2>
              <p className="text-sm text-gray-500 mt-1">Browse all available items from {seller.name}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-gray-100">
              {products.length} Items
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBox className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Products Found</h3>
              <p className="text-gray-500">This store hasn't published any products yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerStorefront;
