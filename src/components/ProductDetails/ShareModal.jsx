import { FiCopy, FiMail, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, productUrl }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl || window.location.href);
    toast.success('Product link copied to clipboard!');
  };

  const handleSocialClick = (platform) => {
    toast.success(`Opening share prompt for ${platform}...`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative space-y-4">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div>
          <h3 className="text-sm font-bold text-gray-900">Share Product</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Disseminate this product across your circles.</p>
        </div>

        {/* Action icons grid */}
        <div className="grid grid-cols-5 gap-3 text-center py-2 text-gray-650">
          <button 
            onClick={() => handleSocialClick('WhatsApp')} 
            className="flex flex-col items-center gap-1.5 p-2 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <FaWhatsapp className="text-green-600 text-lg" />
            <span className="text-[9px] font-bold">WhatsApp</span>
          </button>

          <button 
            onClick={() => handleSocialClick('Facebook')} 
            className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <FaFacebook className="text-blue-700 text-lg" />
            <span className="text-[9px] font-bold">Facebook</span>
          </button>

          <button 
            onClick={() => handleSocialClick('X')} 
            className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <FaTwitter className="text-gray-900 text-lg" />
            <span className="text-[9px] font-bold">X</span>
          </button>

          <button 
            onClick={() => handleSocialClick('Telegram')} 
            className="flex flex-col items-center gap-1.5 p-2 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors"
          >
            <FaTelegram className="text-sky-600 text-lg" />
            <span className="text-[9px] font-bold">Telegram</span>
          </button>

          <button 
            onClick={() => handleSocialClick('Email')} 
            className="flex flex-col items-center gap-1.5 p-2 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <FiMail className="text-[#ff6a00] text-lg" />
            <span className="text-[9px] font-bold">Email</span>
          </button>
        </div>

        {/* Inline Copy URL Input */}
        <div className="flex gap-2 border border-gray-200 p-1.5 rounded-xl bg-gray-50/50">
          <input
            type="text"
            readOnly
            value={productUrl || window.location.href}
            className="flex-1 bg-transparent px-2 outline-none text-[11px] text-gray-500 truncate"
          />
          <button 
            onClick={handleCopy}
            className="bg-[#ff6a00] text-white p-2.5 rounded-lg flex items-center justify-center shadow-sm"
          >
            <FiCopy />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
