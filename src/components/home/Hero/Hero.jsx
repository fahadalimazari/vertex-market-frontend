import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiSmartphone, FiMonitor, FiSpeaker, FiCamera, FiChevronLeft, FiChevronRight, FiGift } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocalization } from '../../../hooks/useLocalization';

const Hero = () => {
  const navigate = useNavigate();
  const { currency, currencies } = useLocalization();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    {
      id: 1,
      desktopImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
      title: 'Next-Gen Computing',
      subtitle: 'Up to 30% Off on Laptops. Experience the power of the latest processors and graphics.',
      badge: 'VERTEX PRO',
      primaryButtonText: 'Shop Now',
      primaryButtonUrl: '/products',
      secondaryButtonText: 'Explore Deals',
      secondaryButtonUrl: '/products?filter=flash-sale',
    },
    {
      id: 2,
      desktopImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop',
      title: 'Smart Audio Series',
      subtitle: 'Immersive Sound Experience with Active Noise Cancellation.',
      badge: 'SONIC BEATS',
      primaryButtonText: 'Shop Now',
      primaryButtonUrl: '/products',
      secondaryButtonText: 'Explore Deals',
      secondaryButtonUrl: '/products?filter=flash-sale',
    },
    {
      id: 3,
      desktopImage: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=2070&auto=format&fit=crop',
      title: 'Gaming Essentials',
      subtitle: 'Elevate your setup with premium gaming gear.',
      badge: 'GAMER X',
      primaryButtonText: 'Shop Now',
      primaryButtonUrl: '/products',
      secondaryButtonText: 'Explore Deals',
      secondaryButtonUrl: '/products?filter=flash-sale',
    }
  ]);

  const resolveMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/hero-banners', {
          params: { _t: Date.now() }, // Cache buster to ensure live reflection of admin changes
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
          setSlides(response.data.data);
        }
      } catch (err) {
        console.warn('Using default hero banners fallback:', err.message);
      }
    };
    fetchHeroBanners();
  }, []);

  const handlePrimaryClick = (e, slide) => {
    e.preventDefault();
    const btnText = slide.primaryButtonText || 'Shop Now';
    console.log('Hero CTA Click', { buttonName: btnText, timestamp: new Date().toISOString(), source: 'Homepage Hero', bannerId: slide._id || slide.id });
    toast.success('Welcome 👋 Explore our featured collection.');
    const targetUrl = slide.primaryButtonUrl || '/products';
    if (slide.openInNewTab && (targetUrl.startsWith('http') || targetUrl.startsWith('www'))) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(targetUrl, { 
        state: { fromHero: true, action: 'shopNow', filter: 'featured', aiContext: 'Need help choosing a product?' } 
      });
    }
  };

  const handleSecondaryClick = (e, slide) => {
    e.preventDefault();
    const btnText = slide.secondaryButtonText || 'Explore Deals';
    console.log('Hero CTA Click', { buttonName: btnText, timestamp: new Date().toISOString(), source: 'Homepage Hero', bannerId: slide._id || slide.id });
    toast.success('Flash Sale Activated 🔥');
    const targetUrl = slide.secondaryButtonUrl || '/products?filter=flash-sale';
    if (slide.openInNewTab && (targetUrl.startsWith('http') || targetUrl.startsWith('www'))) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(targetUrl, { 
        state: { fromHero: true, action: 'exploreDeals', filter: 'flash-sale', aiContext: 'Want the best discount?' } 
      });
    }
  };

  // Auto slide (disabled if only 1 banner exists)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => prev === slides.length - 1 ? 0 : prev + 1);
  const prevSlide = () => setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1);

  const [flashDeal, setFlashDeal] = useState(null);

  const fetchFlashDeal = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/home/flash-sale', {
        params: { _t: Date.now() },
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.data && res.data.success && res.data.data) {
        setFlashDeal(res.data.data);
      } else {
        setFlashDeal(null);
      }
    } catch (err) {
      console.warn('Using default flash sale fallback:', err.message);
    }
  };

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetchFlashDeal();
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/products', {
          params: { pageSize: 3, sort: '-createdAt', status: 'Active', _t: Date.now() },
          headers: { 'Cache-Control': 'no-cache' }
        });
        const items = res.data?.products || res.data?.data;
        if (Array.isArray(items) && items.length > 0) {
          setNewArrivals(items.slice(0, 3));
        }
      } catch (err) {
        console.warn('Using default new arrivals fallback:', err.message);
      }
    };
    fetchNewArrivals();
  }, []);

  const displayArrivals = newArrivals.length >= 3 ? newArrivals : [
    { _id: '1', name: 'Ultra Sharp OLED Monitor', price: 699, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop', slug: 'ultra-sharp-oled-monitor' },
    { _id: '2', name: 'SonicANC Pro Headphones', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop', slug: 'sonicanc-pro-headphones' },
    { _id: '3', name: 'ProCam Titan Mirrorless', price: 1299, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop', slug: 'procam-titan-mirrorless' }
  ];

  const renderProductPrice = (prod) => {
    try {
      if (!prod) return null;
      if (prod.status && prod.status.toLowerCase() !== 'active') return null;

      const hasPrice = prod.price !== undefined && prod.price !== null;
      const hasSalePrice = prod.salePrice !== undefined && prod.salePrice !== null;

      if (!hasPrice && !hasSalePrice) {
        return (
          <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 mt-0.5">
            Price Available Soon
          </div>
        );
      }

      const displayPrice = hasSalePrice ? prod.salePrice : prod.price;
      const originalPrice = hasSalePrice ? prod.price : null;

      const activeCurrency = currency || 'PKR';
      const fallbackList = [
        { code: 'PKR', symbol: 'Rs.', symbolPosition: 'before', exchangeRate: 278.5 },
        { code: 'USD', symbol: '$', symbolPosition: 'before', exchangeRate: 1 },
        { code: 'AED', symbol: 'AED', symbolPosition: 'after', exchangeRate: 3.67 },
        { code: 'EUR', symbol: '€', symbolPosition: 'before', exchangeRate: 0.92 },
        { code: 'GBP', symbol: '£', symbolPosition: 'before', exchangeRate: 0.79 },
        { code: 'SAR', symbol: 'SAR', symbolPosition: 'after', exchangeRate: 3.75 },
        { code: 'INR', symbol: '₹', symbolPosition: 'before', exchangeRate: 83.5 }
      ];

      const activeList = Array.isArray(currencies) && currencies.length > 0 ? currencies : fallbackList;
      
      const pkrObj = activeList.find(c => c.code === 'PKR') || { exchangeRate: 278.5 };
      const pkrRate = pkrObj.exchangeRate || 278.5;

      const activeObj = activeList.find(c => c.code === activeCurrency) || { code: 'PKR', symbol: 'Rs.', symbolPosition: 'before', exchangeRate: 278.5 };
      const activeRate = activeObj.exchangeRate || 278.5;
      const symbol = activeObj.symbol || 'Rs.';
      const position = activeObj.symbolPosition || activeObj.placement || 'before';

      const formatVal = (val) => {
        const converted = (val / pkrRate) * activeRate;
        const formattedNum = Math.round(converted).toLocaleString();
        return position === 'before' || position === 'left' ? `${symbol} ${formattedNum}` : `${formattedNum} ${symbol}`;
      };

      return (
        <div className="flex flex-col gap-0.5 mt-0.5">
          <div className="text-[11px] font-black text-orange-400 leading-none">
            {formatVal(displayPrice)}
          </div>
          {originalPrice && (
            <div className="text-[9px] text-gray-400 line-through leading-none">
              {formatVal(originalPrice)}
            </div>
          )}
        </div>
      );
    } catch (e) {
      console.error('Error rendering product price:', e);
      return (
        <div className="text-[11px] font-black text-orange-400 leading-none mt-0.5">
          Rs. {Number(prod?.price || 0).toLocaleString()}
        </div>
      );
    }
  };

  const handleFlashCardClick = (e) => {
    e.preventDefault();
    if (flashDeal && flashDeal._id) {
      axios.post(`http://localhost:5000/api/v1/flash-sales/${flashDeal._id}/track`, { event: 'click' }).catch(() => {});
    }
    const slug = flashDeal?.productId?.slug || 'samsung-galaxy-s23-ultra';
    const targetUrl = flashDeal?.buttonUrl || `/product/${slug}`;
    navigate(targetUrl, { state: { fromHeroFlashSale: true } });
  };

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 4, minutes: 45, seconds: 12 });
  useEffect(() => {
    const timer = setInterval(() => {
      if (flashDeal && flashDeal.saleEndDate) {
        const diff = new Date(flashDeal.saleEndDate).getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          fetchFlashDeal(); // automatically reload next active flash sale when timer reaches zero
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ days, hours, minutes, seconds });
        }
      } else {
        setTimeLeft(prev => {
          let { days = 0, hours, minutes, seconds } = prev;
          if (hours === 0 && minutes === 0 && seconds === 0 && days === 0) return { days: 0, hours: 4, minutes: 45, seconds: 12 };
          
          if (seconds > 0) {
            seconds--;
          } else {
            seconds = 59;
            if (minutes > 0) {
              minutes--;
            } else {
              minutes = 59;
              if (hours > 0) {
                hours--;
              } else if (days > 0) {
                days--;
                hours = 23;
              }
            }
          }
          return { days, hours, minutes, seconds };
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [flashDeal]);

  const formatTime = (time) => time < 10 ? `0${time}` : time;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col lg:flex-row gap-5 lg:h-[450px] w-full">
        {/* Left: Main Slider */}
        <div className="flex-[2] relative rounded-2xl overflow-hidden min-h-[380px] lg:min-h-0 lg:h-full bg-gray-900 shadow-sm group">
          
          {/* Background Animations */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {slides.map((slide, index) => (
            <div 
              key={slide._id || slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent z-10"></div>
              <img src={resolveMediaUrl(slide.desktopImage || slide.image)} alt={slide.altText || slide.title} className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700" />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12 w-full md:w-2/3">
                <span className="inline-block px-3.5 py-1 bg-white/10 backdrop-blur-md text-orange-400 text-xs font-bold tracking-wider uppercase rounded-full mb-4 w-fit border border-orange-500/30">
                  {slide.badge || slide.brand || 'VERTEX PRO'}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-[1.15] mb-4">
                  {slide.title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-6 max-w-md leading-relaxed line-clamp-2">
                  {slide.subtitle || slide.description}
                </p>
                
                <div className="flex flex-wrap gap-3.5">
                  <motion.button 
                    onClick={(e) => handlePrimaryClick(e, slide)}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-colors group/btn shadow-sm cursor-pointer"
                  >
                    {slide.primaryButtonText || 'Shop Now'}
                    <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button 
                    onClick={(e) => handleSecondaryClick(e, slide)}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-colors shadow-sm cursor-pointer"
                  >
                    <FiGift className="text-orange-400" />
                    {slide.secondaryButtonText || 'Explore Deals'}
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Slider Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0 cursor-pointer"
          >
            <FiChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 cursor-pointer"
          >
            <FiChevronRight size={20} />
          </button>

          {/* Slider Indicators (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-gray-900/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/50 hover:bg-white/100'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Offer Cards & Countdown */}
        <div className="flex-1 flex flex-col gap-4 lg:h-full min-w-0 sm:min-w-[310px]">
          
          {/* Top Right Card: Compact Enterprise Flash Deal */}
          <div 
            onClick={handleFlashCardClick}
            className="flex-1 lg:h-[calc((100%-16px)/2)] rounded-2xl p-4 sm:p-5 bg-gradient-to-tr from-slate-950 via-gray-900 to-neutral-900 text-white border border-gray-800/80 shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-orange-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/30 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/60 to-transparent pointer-events-none z-0"></div>
            
            <div className="relative z-10 max-w-[66%] sm:max-w-[68%] flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider mb-1 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>{flashDeal?.badge || 'Live Deal'}</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-orange-400 transition-colors duration-300 truncate">
                  {flashDeal?.productId?.name || flashDeal?.saleName || 'Samsung Galaxy S23 Ultra'}
                </h3>
                
                <div className="flex flex-wrap items-baseline gap-2 my-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                    {flashDeal?.salePrice !== undefined ? `$${flashDeal.salePrice.toLocaleString()}` : '$1,199'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-400 line-through">
                    {flashDeal?.originalPrice !== undefined ? `$${flashDeal.originalPrice.toLocaleString()}` : '$1,499'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[10px] sm:text-xs shadow shadow-red-500/20 uppercase tracking-wide">
                    {flashDeal?.discountValue ? `-${flashDeal.discountValue}${flashDeal.discountType === 'Percentage' ? '%' : ' OFF'}` : '-20%'}
                  </span>
                </div>
              </div>

              {/* Compact Integrated Countdown & Action Pill */}
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-gray-700/60 text-xs font-bold text-white shadow-inner">
                  <FiClock className="text-orange-400 text-xs sm:text-sm shrink-0 mr-0.5" />
                  {timeLeft.days > 0 && (
                    <>
                      <span>{formatTime(timeLeft.days)}</span>
                      <span className="text-[9px] text-gray-400 font-normal mr-0.5">d</span>
                      <span className="text-gray-600 font-normal">:</span>
                    </>
                  )}
                  <span>{formatTime(timeLeft.hours)}</span>
                  <span className="text-[9px] text-gray-400 font-normal mr-0.5">h</span>
                  <span className="text-gray-600 font-normal">:</span>
                  <span>{formatTime(timeLeft.minutes)}</span>
                  <span className="text-[9px] text-gray-400 font-normal mr-0.5">m</span>
                  <span className="text-gray-600 font-normal">:</span>
                  <span className="text-orange-400 animate-pulse">{formatTime(timeLeft.seconds)}</span>
                  <span className="text-[9px] text-orange-400 font-normal">s</span>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleFlashCardClick(e); }}
                  className="h-8 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer hover:translate-x-0.5 active:scale-95"
                >
                  <span>{flashDeal?.buttonText || 'Shop'}</span>
                  <FiArrowRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* Compact Seamless Product Showcase */}
            <div className="absolute right-[-3%] sm:right-2 top-1/2 -translate-y-1/2 w-36 h-36 sm:w-40 sm:h-40 z-1 flex items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:-translate-x-1.5">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-amber-500/10 to-transparent rounded-full blur-xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src={flashDeal?.productId?.image || "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop"} 
                alt={flashDeal?.productId?.name || "Samsung Galaxy S23 Ultra"} 
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain sm:object-cover rounded-xl drop-shadow-2xl z-10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Bottom Right Card: Compact New Arrivals Hub */}
          <div className="flex-1 lg:h-[calc((100%-16px)/2)] rounded-2xl py-3 px-4 sm:py-3.5 sm:px-5 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white border border-gray-800/80 shadow-lg hover:shadow-xl hover:border-blue-500/40 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/25 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none"></div>
            
            <div className="flex items-start justify-between gap-3 relative z-10 mb-0.5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 backdrop-blur-md border border-blue-500/30 text-blue-400 font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">
                  <span>Featured Collection</span>
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  <span className="text-white/90">New Arrivals</span>
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-black text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                  Next-Gen Tech Innovations
                </h3>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium mt-0.5 line-clamp-2 max-w-xs leading-snug">
                  Explore state-of-the-art electronics freshly added to our catalog.
                </p>
              </div>

              <Link 
                to="/products?filter=new-arrivals"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white text-gray-950 hover:bg-gray-100 font-extrabold text-xs transition-all shadow-sm shrink-0 hover:translate-x-0.5 active:scale-95 z-10"
              >
                <span>Explore</span>
                <FiArrowRight className="text-xs text-gray-950" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-auto relative z-10">
              {displayArrivals.slice(0, 3).map((prod, idx) => (
                <Link 
                  key={prod._id || idx}
                  to={`/product/${prod.slug || 'featured-item'}`}
                  className="bg-gray-800/60 hover:bg-gray-800/90 border border-gray-700/60 hover:border-blue-500/50 rounded-xl p-1 sm:p-1.5 flex flex-col transition-all duration-300 group/card hover:-translate-y-0.5 shadow-sm overflow-hidden"
                >
                  <div className="w-full h-7 sm:h-9 rounded-lg bg-gray-900 overflow-hidden relative mb-1 flex items-center justify-center">
                    <img 
                      src={prod.image || 'https://via.placeholder.com/150'} 
                      alt={prod.name} 
                      className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-500" 
                    />
                    <span className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 backdrop-blur-md text-[8px] font-black text-blue-400 border border-blue-500/30 uppercase tracking-wider leading-none">
                      NEW
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-bold text-white text-[9px] sm:text-[10px] md:text-[11px] line-clamp-2 h-6 sm:h-8 leading-tight group-hover/card:text-blue-300 transition-colors overflow-hidden">
                      {prod.name}
                    </h4>
                    {renderProductPrice(prod)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Brand Logos Section */}
      <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden flex items-center">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-8 whitespace-nowrap hidden md:block">Trusted By</span>
        <div className="flex-1 overflow-hidden relative">
          {/* Fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Logo Track */}
          <div className="flex gap-8 md:gap-12 items-center justify-between opacity-60 grayscale hover:grayscale-0 transition-all duration-500 px-4">
            {['Sony', 'Samsung', 'Apple', 'Dell', 'LG', 'Asus'].map((brand, i) => (
              <div key={i} className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter">
                {brand.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
