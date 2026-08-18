import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { FiX, FiGlobe, FiDollarSign, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const LocalizationModal = ({ isOpen, onClose, triggerRef }) => {
  const { 
    language: currentLang, 
    currency: currentCurr, 
    languages, 
    currencies, 
    changeLanguage,
    changeCurrency,
    t
  } = useLocalization();

  const [activeTab, setActiveTab] = useState('language'); // 'language' or 'currency'
  const [positionStyle, setPositionStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle closing with focus restoration
  const handleClose = useCallback(() => {
    onClose();
    if (triggerRef?.current) {
      triggerRef.current.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [onClose, triggerRef]);

  // Calculate precise positioning relative to trigger button (Amazon / Shopify UX)
  const updatePosition = useCallback(() => {
    if (!isOpen) return;
    
    const screenWidth = window.innerWidth;
    const isMobileScreen = screenWidth < 768;
    setIsMobile(isMobileScreen);

    if (isMobileScreen || !triggerRef?.current) {
      // Mobile / tablet bottom sheet or fallback center modal
      setPositionStyle({});
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const gap = 10; // 8-12px required gap from trigger
    const dropdownWidth = Math.min(400, screenWidth - 32);
    const estimatedHeight = 440;

    let top = triggerRect.bottom + gap;
    let bottom = 'auto';

    // If there isn't enough space below, flip above trigger
    if (top + estimatedHeight > window.innerHeight && triggerRect.top - gap - estimatedHeight > 0) {
      top = 'auto';
      bottom = window.innerHeight - triggerRect.top + gap;
    }

    // Align right edge of dropdown with right edge of trigger
    let right = screenWidth - triggerRect.right;
    let left = 'auto';

    // Prevent viewport overflow on right side
    if (right < 16) {
      right = 16;
    }
    // Prevent viewport overflow on left side if width extends too far left
    if (screenWidth - right - dropdownWidth < 16) {
      left = 16;
      right = 'auto';
    }

    setPositionStyle({
      position: 'fixed',
      top: top === 'auto' ? 'auto' : `${top}px`,
      bottom: bottom === 'auto' ? 'auto' : `${bottom}px`,
      right: right === 'auto' ? 'auto' : `${right}px`,
      left: left === 'auto' ? 'auto' : `${left}px`,
      width: `${dropdownWidth}px`
    });
  }, [isOpen, triggerRef]);

  // Disable background scroll & attach positioning / Escape key listeners
  useEffect(() => {
    if (!isOpen) return;

    // Store element that had focus before opening
    previousFocusRef.current = document.activeElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Initial calculation and resize/scroll binding
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { capture: true });

    // Move focus into dropdown for accessibility
    setTimeout(() => {
      dropdownRef.current?.focus();
    }, 10);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, { capture: true });
    };
  }, [isOpen, updatePosition]);

  // Escape key & keyboard focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'Tab' && dropdownRef.current) {
        // Accessibility Focus Trap
        const focusableElements = dropdownRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Instant apply and close on selection
  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    handleClose();
  };

  const handleSelectCurrency = (code) => {
    changeCurrency(code);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className={`fixed inset-0 z-[9998] touch-none select-none ${
            isMobile || !triggerRef?.current ? 'flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm' : 'bg-transparent'
          }`}
        >
          {/* Backdrop Click Outside Catcher */}
          <div 
            className="absolute inset-0 w-full h-full" 
            onClick={handleClose}
            aria-hidden="true" 
          />

          {/* Dropdown Container */}
          <motion.div
            ref={dropdownRef}
            id="localization-dropdown"
            role="dialog"
            aria-modal="true"
            aria-label="Select Store Language and Currency"
            tabIndex="-1"
            style={!isMobile && triggerRef?.current ? positionStyle : {}}
            initial={
              isMobile ? { opacity: 0, y: 40 } : { opacity: 0, y: -8, scale: 0.96 }
            }
            animate={
              isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              isMobile ? { opacity: 0, y: 40 } : { opacity: 0, y: -8, scale: 0.96 }
            }
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-[9999] bg-white text-gray-900 border border-gray-200 shadow-2xl outline-none overflow-hidden transition-all ${
              isMobile 
                ? 'w-full max-h-[85vh] rounded-t-3xl sm:rounded-2xl pb-6 sm:pb-0' 
                : 'rounded-2xl max-h-[500px] shadow-[0_15px_35px_rgba(0,0,0,0.15),0_5px_15px_rgba(0,0,0,0.08)]'
            }`}
            dir="ltr"
          >
            {/* Top Bar / Header with Tabs and X Close Button */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 bg-gray-50/80 select-none">
              <div className="flex items-center gap-1 bg-gray-200/70 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('language')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'language' 
                      ? 'bg-white text-[#ff6a00] shadow-sm font-black' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiGlobe className="text-sm" />
                  <span>Language</span>
                  <span className="ml-0.5 uppercase px-1.5 py-0.2 bg-orange-100/80 text-[#ff6a00] text-[10px] rounded-md font-mono font-extrabold">
                    {currentLang}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('currency')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'currency' 
                      ? 'bg-white text-[#ff6a00] shadow-sm font-black' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiDollarSign className="text-sm" />
                  <span>Currency</span>
                  <span className="ml-0.5 uppercase px-1.5 py-0.2 bg-green-100/80 text-green-700 text-[10px] rounded-md font-mono font-extrabold">
                    {currentCurr}
                  </span>
                </button>
              </div>

              {/* Required X Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close localization settings"
                className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-200/60 rounded-full transition-colors focus:ring-2 focus:ring-[#ff6a00] outline-none"
                title="Close dropdown (ESC)"
              >
                <FiX className="text-lg stroke-[2.5]" />
              </button>
            </div>

            {/* Content Lists */}
            <div className="p-4 overflow-y-auto max-h-[380px] custom-scrollbar">
              
              {/* TAB 1: LANGUAGE SELECTION */}
              {activeTab === 'language' && (
                <div className="space-y-2">
                  <div className="px-1 mb-2">
                    <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                      Select Region Language
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages?.map((lang) => {
                      const isSelected = currentLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.code)}
                          aria-pressed={isSelected}
                          className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all relative overflow-hidden focus:ring-2 focus:ring-[#ff6a00] outline-none ${
                            isSelected 
                              ? 'border-[#ff6a00] bg-gradient-to-r from-orange-50/80 to-orange-50/30 text-[#ff6a00] ring-1 ring-[#ff6a00]/50 shadow-sm' 
                              : 'border-gray-150 bg-white hover:border-orange-300 hover:bg-gray-50/60 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl shrink-0 leading-none">{lang.flag || '🌐'}</span>
                            <div className="truncate">
                              <p className={`text-xs font-black truncate ${isSelected ? 'text-[#ff6a00]' : 'text-gray-900'}`}>
                                {lang.nativeName}
                              </p>
                              <p className="text-[10px] font-semibold text-gray-500 truncate flex items-center gap-1">
                                <span>{lang.name}</span>
                                {(lang.code === 'ur' || lang.code === 'ar' || lang.dir === 'rtl') && (
                                  <span className="text-[9px] px-1 py-0.5 bg-gray-100 rounded text-gray-500 uppercase font-mono font-black">
                                    RTL
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#ff6a00] text-white flex items-center justify-center shrink-0 shadow-sm">
                              <FiCheck className="text-xs stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CURRENCY SELECTION */}
              {activeTab === 'currency' && (
                <div className="space-y-2">
                  <div className="px-1 mb-2">
                    <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                      Select Storefront Currency & Pricing
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {currencies?.map((curr) => {
                      const isSelected = currentCurr === curr.code;
                      return (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => handleSelectCurrency(curr.code)}
                          aria-pressed={isSelected}
                          className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all relative overflow-hidden focus:ring-2 focus:ring-[#ff6a00] outline-none ${
                            isSelected 
                              ? 'border-[#ff6a00] bg-gradient-to-r from-orange-50/80 to-orange-50/30 text-[#ff6a00] ring-1 ring-[#ff6a00]/50 shadow-sm' 
                              : 'border-gray-150 bg-white hover:border-orange-300 hover:bg-gray-50/60 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-orange-100/50 text-gray-800 group-hover:text-[#ff6a00] font-black text-sm flex items-center justify-center border border-gray-200 shrink-0 transition-colors">
                              {curr.symbol || '$'}
                            </span>
                            <div className="truncate">
                              <p className={`text-xs font-black truncate ${isSelected ? 'text-[#ff6a00]' : 'text-gray-900'}`}>
                                {curr.code}
                              </p>
                              <p className="text-[10px] font-semibold text-gray-500 truncate">
                                {curr.name || curr.code}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#ff6a00] text-white flex items-center justify-center shrink-0 shadow-sm">
                              <FiCheck className="text-xs stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Notice */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>Prices convert dynamically at checkout</span>
              <span className="text-gray-400 font-mono">Press ESC to exit</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocalizationModal;
