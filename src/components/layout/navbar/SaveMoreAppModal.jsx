import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiSmartphone, FiExternalLink } from 'react-icons/fi';
import { FaGooglePlay, FaApple, FaAndroid, FaQrcode } from 'react-icons/fa';

const SaveMoreAppModal = ({ isOpen, onClose }) => {
  const [appSettings, setAppSettings] = useState({
    androidLink: 'https://play.google.com/store/apps',
    iosLink: 'https://apple.com/app-store',
    appGalleryLink: 'https://appgallery.huawei.com',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://vertex-market.com/app',
    version: '2.4.0',
    status: 'Active',
    features: [
      'Faster Checkout',
      'Exclusive Discounts',
      'AI Shopping Assistant',
      'Order Tracking',
      'Flash Sales'
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/app-settings');
        const data = await res.json();
        if (data.success && data.data) {
          setAppSettings(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch app settings, using fallback default values:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl shadow-2xl text-white z-10"
        >
          {/* Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#ff6a00]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#ff6a00] to-orange-600 rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                <FiSmartphone className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Download Vertex Market App
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                    v{appSettings.version || '2.4.0'}
                  </span>
                </h3>
                <p className="text-xs text-gray-400">Experience next-gen AI shopping, exclusive app deals, and instant tracking.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Features & Store Buttons */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
                  Exclusive Mobile Benefits
                </h4>
                <ul className="space-y-2.5">
                  {(appSettings.features || []).map((feat, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2.5 text-sm font-semibold text-gray-200"
                    >
                      <FiCheckCircle className="text-[#ff6a00] flex-shrink-0 text-base" />
                      <span>{feat}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Download Buttons */}
              <div className="space-y-3 pt-2 border-t border-gray-800/60">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Get it now on your favorite platform
                </span>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={appSettings.androidLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-800/90 hover:bg-gray-800 text-white rounded-xl border border-gray-700/80 hover:border-gray-600 transition-all shadow-md group"
                  >
                    <FaGooglePlay className="text-green-400 text-lg group-hover:scale-110 transition-transform" />
                    <div className="text-left leading-tight">
                      <span className="block text-[9px] font-medium uppercase tracking-wider text-gray-400">Get it on</span>
                      <span className="text-xs font-black tracking-wide">Google Play</span>
                    </div>
                  </a>

                  <a
                    href={appSettings.iosLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-800/90 hover:bg-gray-800 text-white rounded-xl border border-gray-700/80 hover:border-gray-600 transition-all shadow-md group"
                  >
                    <FaApple className="text-white text-xl group-hover:scale-110 transition-transform" />
                    <div className="text-left leading-tight">
                      <span className="block text-[9px] font-medium uppercase tracking-wider text-gray-400">Download on the</span>
                      <span className="text-xs font-black tracking-wide">App Store</span>
                    </div>
                  </a>
                </div>

                {appSettings.appGalleryLink && (
                  <div className="pt-1">
                    <a
                      href={appSettings.appGalleryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-800/50 hover:bg-gray-800/80 text-gray-300 rounded-lg text-[11px] font-bold transition-all border border-gray-750"
                    >
                      <FaAndroid className="text-orange-500" />
                      <span>Huawei AppGallery</span>
                      <FiExternalLink className="text-gray-500 text-xs ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: QR Code Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-gradient-to-b from-gray-800/60 to-gray-900/90 border border-gray-750/80 rounded-2xl shadow-inner text-center relative group">
              <div className="p-3 bg-white rounded-xl shadow-lg mb-3 border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors">
                {appSettings.qrCode ? (
                  <img
                    src={appSettings.qrCode}
                    alt="Vertex Market App QR Code"
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 flex flex-col items-center justify-center bg-gray-100 text-gray-700">
                    <FaQrcode className="text-4xl text-gray-600 mb-1" />
                    <span className="text-[10px] font-bold">Scan to open</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <FaQrcode className="text-[#ff6a00]" /> Scan QR to Install
              </span>
              <p className="text-[11px] text-gray-400 mt-1">
                Point your mobile camera at this QR code for an instant download link.
              </p>
            </div>

          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 bg-gray-950/80 border-t border-gray-800 flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span>🔒 Verified & Malware-Free App</span>
            <span className="text-orange-500 font-bold">1M+ Active Users Globally</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SaveMoreAppModal;
