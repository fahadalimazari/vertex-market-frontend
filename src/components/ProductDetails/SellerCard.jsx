import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiHome, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerCard = ({ seller }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
    toast.success(isFollowing ? 'Unfollowed seller store' : 'Following seller store!');
  };

  return (
    <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm space-y-4 text-xs text-gray-750">
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 uppercase tracking-wider">
        Merchant Store Info
      </h3>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
          {seller.logo ? (
            <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-[#ff6a00]">VS</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight flex items-center gap-1">
            {seller.name} {seller.official && <FiCheck className="text-blue-500 bg-blue-50 rounded-full" />}
          </h4>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Joined since 2021</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-50 text-center">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Rating</span>
          <span className="font-black text-gray-900 text-sm mt-0.5 block">{seller.rating ? Number(seller.rating).toFixed(1) : '0.0'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Response</span>
          <span className="font-black text-gray-900 text-sm mt-0.5 block">{seller.responseTime || '1 Hr'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Followers</span>
          <span className="font-black text-gray-900 text-sm mt-0.5 block">{seller.followers ? seller.followers.toLocaleString() : '1,000+'}</span>
        </div>
      </div>

      {/* Seller actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => toast.success('Starting live chat session with merchant representative...')}
          className="flex items-center justify-center gap-1.5 border border-gray-200 hover:border-[#ff6a00] text-gray-700 hover:text-[#ff6a00] py-2.5 rounded-xl transition-all font-bold"
        >
          <FiMessageSquare className="h-4 w-4" />
          <span>Chat Seller</span>
        </button>

        <button
          onClick={handleFollowToggle}
          className={`flex items-center justify-center gap-1.5 border py-2.5 rounded-xl transition-all font-bold ${
            isFollowing 
              ? 'bg-gray-50 border-gray-200 text-gray-800' 
              : 'border-[#ff6a00]/30 text-[#ff6a00] hover:bg-[#ff6a00]/5'
          }`}
        >
          {isFollowing ? <FiCheck /> : null}
          <span>{isFollowing ? 'Following' : 'Follow Seller'}</span>
        </button>
      </div>

      <Link
        to="/brands/samsung"
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm block text-center"
      >
        <FiHome className="h-4 w-4" />
        <span>Visit Official Store</span>
      </Link>
    </div>
  );
};

export default SellerCard;
