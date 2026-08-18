import { FaRegBookmark } from 'react-icons/fa';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../../../hooks/useLocalization';
import LocalizationModal from '../../Localization/LocalizationModal';
import SaveMoreAppModal from './SaveMoreAppModal';
import NeedHelpModal from './NeedHelpModal';

const TopBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [supportPhone, setSupportPhone] = useState('021-111-746-776');

  const localizationBtnRef = useRef(null);

  const { language, currency, t, languages } = useLocalization();
  const langName = languages?.find(l => l.code === language)?.name || 'English';
  const navigate = useNavigate();

  // Fetch dynamic support phone number from admin Contact API
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/contact');
        const data = await res.json();
        if (data.success && data.data?.supportPhone) {
          setSupportPhone(data.data.supportPhone);
        }
      } catch (err) {
        console.error('TopBar contact settings fallback to default:', err);
      }
    };
    fetchContact();
  }, []);

  return (
    <div className="border-b border-gray-200 bg-white text-[11px] sm:text-[12px] font-medium">
      <div className="mx-auto flex flex-wrap min-h-[40px] py-2 max-w-[1440px] items-center justify-center lg:justify-between px-2 sm:px-6 lg:px-8 gap-x-4 gap-y-2">
        {/* Left: Dynamic Enterprise Marketplace Services */}
        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 text-gray-600">
          <div 
            onClick={() => setIsAppModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-[#ff6a00] transition-colors cursor-pointer group"
            title="Download Vertex Mobile & AI Apps"
          >
            <FaRegBookmark className="text-[#ff6a00] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-gray-700 group-hover:text-[#ff6a00]">Save more on App</span>
          </div>
          <div 
            onClick={() => navigate('/become-seller')}
            className="hover:text-[#ff6a00] transition-colors cursor-pointer font-semibold text-gray-700 hover:underline decoration-[#ff6a00] decoration-2 underline-offset-4"
            title="Apply to Sell on Vertex Marketplace"
          >
            <span>Sell on Vertex Market</span>
          </div>
          <div 
            onClick={() => navigate('/support')}
            className="hover:text-[#ff6a00] transition-colors cursor-pointer font-semibold text-gray-700"
            title="Open Customer Support Center & FAQs"
          >
            <span>Customer Care</span>
          </div>
          <div 
            onClick={() => navigate('/track-order')}
            className="hover:text-[#ff6a00] transition-colors cursor-pointer font-semibold text-gray-700"
            title="Track Order Delivery Progress & Courier Timeline"
          >
            <span>Track Order</span>
          </div>
        </div>

        {/* Right: Help Telephone & Dynamic Localization Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 text-gray-600">
          <div 
            onClick={() => setIsHelpModalOpen(true)}
            className="cursor-pointer hover:text-[#ff6a00] transition-colors flex items-center gap-1"
            title="Click to view Operating Hours, Emergency Contact & WhatsApp Support Desk"
          >
            <span>Need Help?</span> 
            <strong className="font-mono font-black text-gray-900 hover:text-[#ff6a00] bg-gray-100 px-2 py-0.5 rounded-md text-[11px] border border-gray-200">
              {supportPhone}
            </strong>
          </div>
          
          <button 
            ref={localizationBtnRef}
            onClick={() => setIsModalOpen(true)}
            aria-expanded={isModalOpen}
            aria-haspopup="dialog"
            aria-controls="localization-dropdown"
            className="flex items-center gap-1 cursor-pointer hover:text-[#ff6a00] transition-colors bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-lg border border-orange-200/60 font-black text-gray-800 text-[11px] focus:ring-2 focus:ring-[#ff6a00] outline-none"
            title="Switch Language (with RTL Support) or Storefront Currency"
          >
            <span>{langName} | {currency}</span>
            <MdOutlineKeyboardArrowDown className="text-[#ff6a00] text-base" />
          </button>
        </div>
      </div>
      
      {/* Enterprise Modals */}
      <LocalizationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        triggerRef={localizationBtnRef} 
      />
      <SaveMoreAppModal isOpen={isAppModalOpen} onClose={() => setIsAppModalOpen(false)} />
      <NeedHelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default TopBar;