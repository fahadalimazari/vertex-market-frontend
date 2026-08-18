import { useState, useMemo } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import WishlistCard from './WishlistCard';
import EmptyWishlist from './EmptyWishlist';
import { FiHeart, FiSliders } from 'react-icons/fi';

const WishlistGrid = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const [sortBy, setSortBy] = useState('recent');

  const sortedWishlist = useMemo(() => {
    const list = [...wishlist];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'recent':
      default:
        // Assume addedAt is iso timestamp
        return list.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
  }, [wishlist, sortBy]);

  if (wishlist.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiHeart className="text-[#ff6a00] fill-[#ff6a00]" /> My Wishlist
          </h2>
          <p className="text-xs text-gray-500 mt-1">Keep track of products you want to buy</p>
        </div>
        
        {/* Sort & Bulk Clear Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
            <FiSliders className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-700 outline-none border-none cursor-pointer pr-1"
            >
              <option value="recent">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          <button
            onClick={() => window.confirm('Are you sure you want to clear your entire wishlist?') && clearWishlist()}
            className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50/50 px-3.5 py-2.5 rounded-xl border border-red-100 transition-colors"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedWishlist.map((item) => (
          <WishlistCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default WishlistGrid;
