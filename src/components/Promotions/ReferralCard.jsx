import { memo } from 'react';
import { FiUsers, FiCopy, FiShare2, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReferralCard = memo(({ campaign }) => {
  const referralLink = `https://vertexmarket.com/invite/VRTX-${Math.floor(Math.random() * 10000)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const handleShare = () => {
    toast.success('Share menu opened!');
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl mb-6">
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 w-64 h-64 border-[30px] border-white/5 rounded-full"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 border-[20px] border-[#ff6a00]/20 rounded-full"></div>

      <div className="relative z-10">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-6">
          <FiUsers size={28} className="text-[#ff6a00]" />
        </div>

        <h2 className="text-2xl font-black mb-2">{campaign?.title || 'Invite Friends & Earn'}</h2>
        <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
          {campaign?.description || 'Share your referral link. When friends make their first purchase, you both get rewards!'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <div className="flex-1 bg-black/30 border border-white/10 rounded-xl p-2 flex items-center justify-between">
            <span className="text-gray-400 text-sm font-mono px-3 truncate select-all">
              {referralLink}
            </span>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              title="Copy Link"
            >
              <FiCopy />
            </button>
          </div>
          <button 
            onClick={handleShare}
            className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <FiShare2 /> Share Link
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Invites</div>
            <div className="text-2xl font-black">12</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending</div>
            <div className="text-2xl font-black text-yellow-400">3</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Earned</div>
            <div className="text-2xl font-black text-green-400">$90</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <FiGift className="text-[#ff6a00]" size={20} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Next Reward</div>
              <div className="text-sm font-bold">1 Invite Left</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ReferralCard.displayName = 'ReferralCard';
export default ReferralCard;
