import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiTruck, FiPackage, FiCheckCircle, FiClock, 
  FiAlertTriangle, FiPhoneCall, FiMapPin, FiRefreshCw, FiExternalLink, FiCalendar 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderTrackingPortal = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [contactInfo, setContactInfo] = useState(''); // Email or Phone
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);

  // Load integrated couriers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/shipping/providers');
        const data = await res.json();
        if (data.success) setProviders(data.data || []);
      } catch (e) {
        console.error('Failed to load shipping providers:', e);
      }
    };
    fetchProviders();
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter your 5-digit Order Number (e.g., VTX-89021)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/order/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), contact: contactInfo })
      });
      const data = await res.json();
      if (data.success) {
        setTrackingResult(data.data);
        toast.success(`Live tracking loaded for ${data.data.orderNumber}`);
      } else {
        toast.error(data.message || 'Could not locate order details.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network failure connecting to logistics hub.');
    } finally {
      setLoading(false);
    }
  };

  // Demo shortcut trigger
  const loadDemoOrder = () => {
    setOrderNumber('VTX-89021');
    setContactInfo('0300-9876543');
    toast.success('Loaded demo tracking ID VTX-89021!');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <FiTruck className="text-base animate-bounce" /> Real-Time Courier Logistics
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Track Your Order Journey
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Enter your Order Number and email or phone to view live GPS dispatch progress from merchant warehouse to your doorstep.
          </p>

          {/* Quick Demo button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={loadDemoOrder}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6a00] bg-orange-500/10 px-4 py-2 rounded-xl hover:bg-orange-500/20 transition-all border border-orange-500/30"
            >
              <span>Test with Live Sample Order: <strong>VTX-89021</strong></span> <FiExternalLink />
            </button>
          </div>
        </div>
      </section>

      {/* TRACKING INPUT FORM CARD */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <form onSubmit={handleTrack} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Order Number *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., VTX-89021"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm font-black text-gray-900 placeholder-gray-400 uppercase font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Email or Phone *</label>
            <input
              type="text"
              required
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="0300-1234567 or email"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-semibold text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ff6a00] to-orange-600 hover:from-orange-600 hover:to-[#ff6a00] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <FiRefreshCw className="animate-spin text-lg" />
              ) : (
                <>
                  <FiSearch className="text-base" />
                  <span>Track Live</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* TRACKING TIMELINE RESULT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <AnimatePresence>
          {trackingResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* Order Status Header Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6a00] block">Order Tracking Dossier</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">{trackingResult.orderNumber}</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Courier Partner: <strong className="text-gray-800">{trackingResult.courierProvider}</strong> • Waybill # <span className="font-mono text-gray-700 font-bold">{trackingResult.trackingNumber}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Estimated Delivery</span>
                  <div className="flex items-center gap-1.5 text-green-700 font-black text-lg mt-0.5">
                    <FiCalendar className="text-[#ff6a00]" />
                    <span>{trackingResult.estimatedDeliveryDate}</span>
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-2.5 py-0.5 rounded-full border border-green-200 mt-2 uppercase tracking-wide">
                    {trackingResult.status}
                  </span>
                </div>
              </div>

              {/* Multi-Stage Visual Order Timeline */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                  <h4 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <FiPackage className="text-[#ff6a00] text-lg" /> Shipment Progress Timeline
                  </h4>
                  <span className="text-[11px] text-gray-400 font-semibold">Live System Telemetry</span>
                </div>

                {/* Vertical Timeline List */}
                <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                  {trackingResult.timeline?.map((step, index) => {
                    const isCompleted = step.status === 'Completed';
                    const isActive = step.status === 'Active';
                    const isPending = step.status === 'Pending';

                    return (
                      <div key={index} className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        {/* Timeline Icon Point */}
                        <div className={`absolute -left-6 sm:-left-10 top-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-500/20' :
                          isActive ? 'bg-[#ff6a00] text-white border-white ring-4 ring-orange-500/30 animate-pulse' :
                          'bg-white text-gray-300 border-gray-300'
                        }`}>
                          {isCompleted ? <FiCheckCircle className="text-sm" /> : isActive ? <FiTruck className="text-xs" /> : <FiClock className="text-xs" />}
                        </div>

                        {/* Text detail */}
                        <div className="space-y-1">
                          <span className={`text-xs font-black uppercase tracking-wider block ${
                            isCompleted ? 'text-gray-900' : isActive ? 'text-[#ff6a00]' : 'text-gray-400'
                          }`}>
                            {step.stage}
                          </span>
                          <p className="text-xs text-gray-600 font-medium max-w-md">{step.description}</p>
                        </div>

                        {/* Timestamp */}
                        <div className="text-left sm:text-right shrink-0">
                          {step.timestamp ? (
                            <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl block font-mono">
                              {step.timestamp}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium italic">Pending completion</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Courier Driver Card */}
                <div className="bg-orange-50/60 border border-orange-100 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ff6a00] text-white flex items-center justify-center font-black text-lg shadow-md shadow-orange-500/20">
                      🚚
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-orange-600 uppercase block">Dispatch Rider Assigned</span>
                      <h5 className="font-bold text-gray-900 text-sm">TCS Express City Courier Unit #42</h5>
                      <span className="text-[11px] text-gray-500 font-medium">Currently en route within regional distribution zone</span>
                    </div>
                  </div>
                  <a
                    href="tel:021111123456"
                    className="px-4 py-2 bg-gray-900 hover:bg-[#ff6a00] text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <FiPhoneCall /> Contact Courier Support
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            /* INTEGRATION PROVIDERS SHOWCASE (shown when no tracking search yet) */
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-6">
              <div>
                <h3 className="text-base font-black text-gray-900">Enterprise Logistics & Courier Network</h3>
                <p className="text-xs text-gray-500 mt-1">We synchronize live order tracking telematics directly from our verified delivery partners:</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {providers.length === 0 ? (
                  ['TCS Express', 'DHL Global', 'Leopards Courier', 'FedEx International'].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 font-black text-xs text-gray-700">
                      {p}
                    </div>
                  ))
                ) : (
                  providers.map((provider) => (
                    <div key={provider._id || provider.code} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#ff6a00] transition-colors group">
                      <span className="font-black text-xs text-gray-800 block group-hover:text-[#ff6a00]">{provider.name}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Delivery: {provider.estimatedDeliveryDays}</span>
                      <span className="text-[10px] font-bold text-orange-600 font-mono block mt-1">{provider.contactPhone}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default OrderTrackingPortal;
