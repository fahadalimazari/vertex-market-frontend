import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const EmptyWishlist = () => {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm max-w-lg mx-auto">
      <div className="h-20 w-20 mx-auto mb-6 bg-orange-50 text-[#ff6a00] rounded-full flex items-center justify-center animate-pulse">
        <FiHeart className="h-10 w-10 fill-[#ff6a00]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Explore our hot products and add items to your wishlist to keep track of your favorites!
      </p>
      <Link
        to="/products"
        className="inline-flex justify-center bg-[#ff6a00] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#e05e00] transition-colors shadow-md hover:shadow-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyWishlist;
