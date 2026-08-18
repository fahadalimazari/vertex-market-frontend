import { useEffect, useState } from 'react';
import { usePromotions } from '../../hooks/usePromotions';
import FlashSaleBanner from '../../components/Promotions/FlashSaleBanner';
import CouponCard from '../../components/Promotions/CouponCard';
import BundleOffer from '../../components/Promotions/BundleOffer';
import FreeShippingCard from '../../components/Promotions/FreeShippingCard';
import VoucherCard from '../../components/Promotions/VoucherCard';
import { FiTag, FiGift, FiTruck, FiPackage } from 'react-icons/fi';
import { coupons } from '../../data/coupons';

const Promotions = () => {
  const { flashSales, bundleOffers, freeShippingCampaigns, vouchers, collectVoucher, collectedVouchers } = usePromotions();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Vertex Promotions Center</h1>
          <p className="text-gray-600 text-lg">Discover the best deals, coupons, and offers tailored just for you.</p>
        </div>

        {/* Active Flash Sales */}
        {flashSales.length > 0 && (
          <section>
            {flashSales.map(sale => (
              <FlashSaleBanner key={sale.id} flashSale={sale} />
            ))}
          </section>
        )}

        {/* Available Coupons */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FiTag className="text-[#ff6a00] text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Coupons</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.filter(c => c.status === 'active').slice(0, 3).map(coupon => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </section>

        {/* Bundle Deals */}
        {bundleOffers.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <FiPackage className="text-[#ff6a00] text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">Bundle Offers</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bundleOffers.map(bundle => (
                <BundleOffer key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </section>
        )}

        {/* Voucher Center */}
        {vouchers.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <FiGift className="text-[#ff6a00] text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">Voucher Center</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map(voucher => (
                <VoucherCard 
                  key={voucher.id} 
                  voucher={voucher} 
                  isCollected={collectedVouchers.some(v => v.id === voucher.id)}
                  onCollect={collectVoucher}
                />
              ))}
            </div>
          </section>
        )}

        {/* Free Shipping Campaigns */}
        {freeShippingCampaigns.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <FiTruck className="text-[#ff6a00] text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">Free Shipping Deals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freeShippingCampaigns.map(campaign => (
                <FreeShippingCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Promotions;
