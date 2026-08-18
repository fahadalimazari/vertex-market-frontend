import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useLocalization } from '../../../hooks/useLocalization';
import LocalizationModal from '../../Localization/LocalizationModal';
import { ALL_MOBILE_MENU_ITEMS } from '../../../data/navigation';

const MobileMenu = ({ isOpen, onClose }) => {
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const { language, currency, languages } = useLocalization();
  const langName = languages?.find(l => l.code === language)?.name || 'English';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl flex flex-col justify-between lg:hidden"
            >
              <div>
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-6">
                  <h2 className="text-lg font-semibold text-[#111827]">Menu</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#374151] hover:bg-[#F8F9FA] transition-colors"
                    aria-label="Close menu"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4 overflow-y-auto max-h-[60vh]">
                  <ul className="space-y-1">
                    {ALL_MOBILE_MENU_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link
                            to={item.href}
                            className="flex h-[48px] items-center gap-4 rounded-[10px] px-4 text-[15px] font-medium text-[#374151] hover:bg-[#F8F9FA] transition-colors"
                            onClick={onClose}
                          >
                            <Icon className="h-5 w-5 text-gray-500" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {/* Footer Section with Account & Localization Trigger */}
              <div className="p-4 border-t border-[#E5E7EB] space-y-3 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsLocModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-[#ff6a00] text-gray-800 font-bold text-sm transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <FiGlobe className="text-lg text-[#ff6a00]" />
                    <span>Language & Currency</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-orange-50 text-[#ff6a00] font-black text-xs border border-orange-200/60 font-mono">
                    {langName} | {currency}
                  </span>
                </button>

                <Link
                  to="/account"
                  className="flex h-[48px] items-center justify-center rounded-[10px] bg-[#ff6a00] text-[15px] font-bold text-white hover:bg-orange-600 transition-colors shadow-sm"
                  onClick={onClose}
                >
                  My Account Dashboard
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Localization Sheet */}
      <LocalizationModal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
      />
    </>
  );
};

export default MobileMenu;