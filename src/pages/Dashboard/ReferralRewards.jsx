import { useState, useEffect } from 'react';
import ReferralCard from '../../components/Promotions/ReferralCard';
import { referralRewards } from '../../data/promotions';

const ReferralRewards = () => {
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    // In a real app, fetch the active referral campaign from context/service
    setCampaign(referralRewards.activeCampaign);
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referral Rewards</h1>
        <p className="text-sm text-gray-500 mt-1">Invite friends and earn rewards when they make their first purchase.</p>
      </div>

      <ReferralCard campaign={campaign} />

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6a00] font-black flex items-center justify-center mb-3">1</div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">Share your link</h4>
            <p className="text-xs text-gray-500">Copy your unique referral link and share it with friends via email or social media.</p>
            <div className="hidden md:block absolute top-4 left-10 right-0 border-t border-dashed border-gray-200"></div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6a00] font-black flex items-center justify-center mb-3">2</div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">Friends sign up</h4>
            <p className="text-xs text-gray-500">When your friends register using your link, they receive a $10 welcome coupon.</p>
            <div className="hidden md:block absolute top-4 left-10 right-0 border-t border-dashed border-gray-200"></div>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6a00] font-black flex items-center justify-center mb-3">3</div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">You get rewarded</h4>
            <p className="text-xs text-gray-500">Once they complete their first order over $50, you earn $10 directly to your wallet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewards;
