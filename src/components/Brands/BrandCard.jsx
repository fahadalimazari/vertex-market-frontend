import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiArrowRight } from 'react-icons/fi';

const BrandCard = ({ brand }) => {
  return (
    <div className="bg-white border border-gray-100 hover:border-[#ff6a00]/20 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
      {/* Brand Identification */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl border border-gray-50 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 bg-gray-50/50">
          <img src={brand.logo} alt={`${brand.name} Logo`} className="max-h-full max-w-full object-contain rounded-xl" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight flex items-center gap-1">
            {brand.name}
            {brand.verified && (
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400 font-bold">
            <span className="flex items-center gap-0.5 text-orange-500">
              <FiStar className="h-3 w-3 fill-orange-500" /> {brand.customerRating || brand.rating || 0}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <FiUsers className="h-3 w-3" /> 
              {brand.followers ? brand.followers.length : 0} followers
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {brand.description}
      </p>

      {/* Primary Action Button */}
      <Link
        to={`/brands/${brand.slug}`}
        className="w-full bg-gray-50 hover:bg-[#ff6a00] hover:text-white border border-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
      >
        <span>Visit Brand Store</span>
        <FiArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default BrandCard;
