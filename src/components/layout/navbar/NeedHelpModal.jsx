import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPhoneCall, FiMail, FiClock, FiMapPin, FiMessageCircle, FiAlertCircle, FiExternalLink } from 'react-icons/fi';

const NeedHelpModal = ({ isOpen, onClose }) => {
  const [contact, setContact] = useState({
    supportPhone: '021-111-746-776',
    emergencyContact: '+92-300-9876543',
    whatsapp: 'https://wa.me/923009876543',
    supportEmail: 'support@vertex-market.com',
    workingHours: 'Mon - Sat: 9:00 AM to 9:00 PM (PKT)',
    holidayHours: 'Sundays & National Holidays: 11:00 AM to 5:00 PM (PKT)',
    officeAddress: 'Vertex Enterprise Tower, Suite 402, Main Shahrah-e-Faisal, Karachi, Pakistan',
    mapUrl: 'https://maps.google.com/?q=Shahrah-e-Faisal+Karachi',
    liveChatEnabled: true,
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchContact = async () => {
      try {
        const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/contact');
        const data = await res.json();
        if (data.success && data.data) {
          setContact(data.data);
        }
      } catch (error) {
        console.error('Failed to load contact settings, using defaults:', error);
      }
    };
    fetchContact();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl shadow-2xl text-white z-10 overflow-hidden"
        >
          {/* Decorative glows */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#ff6a00]/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#ff6a00] to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                <FiPhoneCall className="text-xl animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Vertex Customer Care Hub
                  {contact.liveChatEnabled && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Live Support
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">Our dedicated support architects are standing by to assist you.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5 text-xs">
            
            {/* Primary Phone & WhatsApp Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${contact.supportPhone.replace(/[^0-9+]/g, '')}`}
                className="p-4 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-[#ff6a00] rounded-2xl transition-all shadow-md group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Toll-Free Helpline</span>
                  <FiPhoneCall className="text-gray-400 group-hover:text-[#ff6a00] text-base transition-colors" />
                </div>
                <span className="text-base font-black tracking-wide text-white block font-mono">{contact.supportPhone}</span>
                <span className="text-[10px] text-gray-400 mt-1">Tap to open phone dialer on mobile</span>
              </a>

              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-green-950/60 hover:bg-green-900/60 border border-green-800/80 hover:border-green-500 rounded-2xl transition-all shadow-md group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">Instant WhatsApp Desk</span>
                  <FiMessageCircle className="text-green-400 text-lg group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-bold text-white block">Connect via WhatsApp</span>
                <span className="text-[10px] text-green-300 mt-1 flex items-center gap-1">Fastest answer time (&lt;5 mins) <FiExternalLink /></span>
              </a>
            </div>

            {/* Operating Hours Box */}
            <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-gray-300 font-bold text-xs border-b border-gray-800 pb-2">
                <FiClock className="text-[#ff6a00]" />
                <span>Operating Business Hours</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-gray-400 block font-semibold">Standard Schedule:</span>
                  <span className="text-white font-bold">{contact.workingHours}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Weekend & Holidays:</span>
                  <span className="text-orange-400 font-bold">{contact.holidayHours}</span>
                </div>
              </div>
            </div>

            {/* Emergency & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200">
                <div className="flex items-center gap-1.5 font-bold text-red-400 text-xs mb-1">
                  <FiAlertCircle /> Emergency After-Hours
                </div>
                <p className="text-[10px] text-gray-300">For urgent shipment freezes or fraud alerts outside office hours:</p>
                <a href={`tel:${contact.emergencyContact.replace(/[^0-9+]/g, '')}`} className="font-bold text-white block mt-1 hover:underline text-xs font-mono">
                  {contact.emergencyContact}
                </a>
              </div>

              <div className="p-3.5 bg-gray-800/40 border border-gray-800 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-gray-200 text-xs mb-1">
                    <FiMapPin className="text-[#ff6a00]" /> Central Headquarters
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">{contact.officeAddress}</p>
                </div>
                <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-orange-400 hover:underline inline-flex items-center gap-1 mt-2">
                  View Google Maps Route <FiExternalLink />
                </a>
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="px-6 py-3 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-[11px]">
            <a href={`mailto:${contact.supportEmail}`} className="text-gray-400 hover:text-white flex items-center gap-1.5 font-medium">
              <FiMail className="text-[#ff6a00]" /> {contact.supportEmail}
            </a>
            <a href="/support" className="font-bold text-[#ff6a00] hover:underline flex items-center gap-1">
              Visit Full Support & FAQ Center &rarr;
            </a>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NeedHelpModal;
