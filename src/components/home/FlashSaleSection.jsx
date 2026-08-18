import { memo, useState, useEffect } from 'react';
import { FiZap, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';

const FlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 45, seconds: 12 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (hours === 0 && minutes === 0 && seconds === 0) return { hours: 4, minutes: 45, seconds: 12 };
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (t) => (t < 10 ? `0${t}` : t);

  return (
    <div className="flex items-center gap-1.5 mt-2 lg:mt-0">
      <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-white font-mono font-bold tracking-widest text-sm shadow-sm">{format(timeLeft.hours)}</div>
      <span className="text-white/60 font-black">:</span>
      <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-white font-mono font-bold tracking-widest text-sm shadow-sm">{format(timeLeft.minutes)}</div>
      <span className="text-white/60 font-black">:</span>
      <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-white font-mono font-bold tracking-widest text-sm shadow-sm">{format(timeLeft.seconds)}</div>
    </div>
  );
};

const FlashSaleSection = ({ products = [] }) => {
  if (products.length === 0) return null;

  return (
    <section className="py-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-1 md:p-1.5 shadow-xl shadow-orange-500/20">
        <div className="bg-gray-50/95 backdrop-blur-3xl rounded-[20px] overflow-hidden">
          
          {/* Header Area */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-inner animate-pulse">
                <FiZap className="text-white text-xl fill-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Flash Sale</h2>
                <p className="text-red-100 text-xs font-bold uppercase tracking-wider">Hurry! Deals end soon.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-4 lg:mt-0">
              <FlashSaleTimer />
              <Link 
                to="/products?filter=flash-sale" 
                className="hidden sm:flex items-center gap-2 text-white text-xs font-bold hover:text-white/80 transition-colors uppercase tracking-wider"
              >
                View All Deals <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-orange-50/50 to-white">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {products.slice(0, 5).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default memo(FlashSaleSection);
