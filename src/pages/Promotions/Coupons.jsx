import { coupons } from '../../data/coupons';
import CouponCard from '../../components/Promotions/CouponCard';
import { FiTag } from 'react-icons/fi';

const CouponsPage = () => {
  const activeCoupons = coupons.filter(c => c.status === 'active');

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FiTag className="text-[#ff6a00]" /> Coupon Center
          </h1>
          <p className="text-gray-600 text-lg">Browse all available discount codes to use at checkout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeCoupons.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
