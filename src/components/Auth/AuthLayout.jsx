import { Outlet, Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiTruck, FiCpu, FiAward } from 'react-icons/fi';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 lg:py-0 px-4 sm:px-6 lg:px-0">
      <div className="mx-auto w-full max-w-[1100px] bg-white lg:grid lg:grid-cols-12 rounded-2xl overflow-hidden shadow-xl border border-gray-100 min-h-[640px]">
        
        {/* Left Column - Branding (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6a00_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

          {/* Top - Brand Logo */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                VERTEX<span className="text-[#ff6a00]">MARKET</span>
              </span>
            </Link>
            <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
              The Next-Gen Marketplace
            </p>
          </div>

          {/* Middle - Interactive Vector Illustration */}
          <div className="relative z-10 my-8 flex justify-center items-center">
            <svg 
              className="w-48 h-48 text-[#ff6a00]" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="circleGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff6a00" />
                  <stop offset="100%" stopColor="#e05e00" />
                </linearGradient>
              </defs>
              {/* Outer Orbit */}
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="opacity-40" />
              {/* Inner Orbit */}
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" className="opacity-20" />
              {/* Central Glowing Shield/Core */}
              <rect x="75" y="75" width="50" height="50" rx="12" fill="url(#circleGrad)" className="shadow-lg animate-pulse" />
              <path d="M92 105l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Satellites */}
              <circle cx="45" cy="55" r="8" fill="#ff8c3a" />
              <circle cx="155" cy="145" r="10" fill="#38bdf8" />
              <circle cx="140" cy="50" r="6" fill="#a855f7" />
            </svg>
          </div>

          {/* Bottom - Features Checklist */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <FiShield className="h-5 w-5 text-[#ff6a00] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Secure Shopping</h4>
                <p className="text-xs text-gray-400">Enterprise-grade encryption and purchase security.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiTruck className="h-5 w-5 text-[#ff6a00] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Fast Delivery</h4>
                <p className="text-xs text-gray-400">Track shipments in real-time from checkout to door.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiCpu className="h-5 w-5 text-[#ff6a00] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">AI Shopping Assistant</h4>
                <p className="text-xs text-gray-400">Get tailored advice and deals from our smart AI agent.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiAward className="h-5 w-5 text-[#ff6a00] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Trusted Marketplace</h4>
                <p className="text-xs text-gray-400">Join millions of customers with certified sellers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Area */}
        <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 md:p-14 lg:p-16">
          {/* Logo for Mobile only */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">
              VERTEX<span className="text-[#ff6a00]">MARKET</span>
            </Link>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
              Secure Checkout Portal
            </p>
          </div>

          {/* Outlet for auth children */}
          <div className="w-full max-w-[420px] mx-auto">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
