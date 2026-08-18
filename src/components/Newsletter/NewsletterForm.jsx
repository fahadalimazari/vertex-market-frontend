import { useState } from 'react';
import { useNewsletter } from '../../hooks/useNewsletter';
import { FiMail, FiCheckCircle, FiGift, FiArrowRight } from 'react-icons/fi';

const NewsletterForm = ({ source = 'Homepage' }) => {
  const { subscribe, loading } = useNewsletter();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await subscribe(email, source);
      setIsSubscribed(true);
    } catch (err) {
      // Errors handled globally by toast in service layer
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-[#ff6a00]/5 border border-[#ff6a00]/25 rounded-3xl p-6 md:p-8 text-center space-y-4 max-w-lg mx-auto">
        <FiCheckCircle className="h-12 w-12 text-[#ff6a00] mx-auto" />
        <div>
          <h3 className="text-lg font-black text-gray-900">Thank You for Subscribing!</h3>
          <p className="text-xs text-gray-500 mt-1">Check your inbox for active updates. Here is your exclusive gift:</p>
        </div>

        <div className="bg-white border border-[#ff6a00]/20 p-4 rounded-2xl flex items-center justify-between gap-4 max-w-xs mx-auto">
          <div className="flex items-center gap-2">
            <FiGift className="text-[#ff6a00] text-lg flex-shrink-0" />
            <div className="text-left">
              <span className="text-[10px] text-gray-400 font-bold block">PROMO CODE</span>
              <span className="font-mono font-bold text-gray-800 text-xs">VERTEXWELCOME</span>
            </div>
          </div>
          <span className="text-[10px] bg-orange-50 text-[#ff6a00] font-bold px-2 py-0.5 rounded">15% OFF</span>
        </div>

        <button
          onClick={() => {
            setIsSubscribed(false);
            setEmail('');
          }}
          className="text-xs font-bold text-gray-500 hover:text-[#ff6a00] hover:underline"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 border border-gray-850 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-2 text-center md:text-left max-w-md">
        <h3 className="text-xl md:text-2xl font-black tracking-tight">Subscribe to our newsletter</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Be the first to hear about flash sales, brand store discounts, and custom recommendations. No spam.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Enter your email address..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-1 focus:ring-[#ff6a00] focus:border-[#ff6a00] outline-none text-xs text-white placeholder-gray-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Subscribing...' : 'Join Newsletter'}
          <FiArrowRight />
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
