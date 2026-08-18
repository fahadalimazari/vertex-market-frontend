import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import BadgeRenderer from '../Admin/BadgeRenderer';

const StoreCard = ({ store }) => {
  return (
    <div className="bg-white border border-gray-100 hover:border-[#ff6a00]/20 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
      
      {/* Badges (Top Area) */}
      {store.badges && store.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {store.badges.slice(0, 3).map((badge, index) => (
            <span 
              key={index} 
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold shadow-sm text-white ${
                badge.source === 'admin' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500'
              }`}
            >
              <BadgeRenderer icon={badge.icon || badge.label} /> {badge.label}
            </span>
          ))}
        </div>
      )}

      {/* Store Identification */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl border border-gray-50 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 bg-gray-50/50">
          {store.storeLogo || store.logo ? (
            <img src={store.storeLogo || store.logo} alt={`${store.storeName || store.name} Logo`} className="max-h-full max-w-full object-contain rounded-xl" />
          ) : (
            <div className="text-xl font-black text-gray-300">
              {(store.storeName || store.name)?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight flex items-center gap-1">
            {store.storeName || store.name}
            {(!store.badges || store.badges.length === 0) && (
              <FiCheckCircle className="text-blue-500 h-3.5 w-3.5 shrink-0" />
            )}
          </h4>
          <div className="flex items-center flex-wrap gap-1.5 mt-0.5 text-[10px] text-gray-400 font-bold">
            <span className="flex items-center gap-0.5 text-orange-500">
              <FiStar className="h-3 w-3 fill-orange-500" /> {store.rating?.toFixed(1) || '0.0'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <FiUsers className="h-3 w-3" /> {(store.followers || 0).toLocaleString()} followers
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              {(store.productCount || 0).toLocaleString()} products
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
        {store.description || store.storeDescription || 'Explore products from this trusted store.'}
      </p>

      {/* Primary Action Button */}
      <Link
        to={`/seller/${store.storeSlug || store.slug}`}
        className="w-full bg-gray-50 hover:bg-[#ff6a00] hover:text-white border border-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 mt-auto"
      >
        <span>Visit Store</span>
        <FiArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default StoreCard;
