import WishlistGrid from '../../components/Wishlist/WishlistGrid';

const Wishlist = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[500px]">
        <WishlistGrid />
      </div>
    </div>
  );
};

export default Wishlist;
