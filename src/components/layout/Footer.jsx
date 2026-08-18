import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone, FiShield, FiLock, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import newsletterService from '../../services/newsletterService';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mobile accordion state
  const [openSection, setOpenSection] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await newsletterService.subscribe(email, 'Footer');
      setEmail('');
    } catch (error) {
      // Error is handled by newsletterService with a toast
    } finally {
      setLoading(false);
    }
  };

  const handleComingSoon = (e, featureName) => {
    e.preventDefault();
    toast(`${featureName} is coming soon!`, { icon: '🚀' });
  };

  const currentYear = new Date().getFullYear();

  // Helper for footer links to support mobile accordion
  const FooterSection = ({ title, children }) => {
    const isOpen = openSection === title;
    
    return (
      <div className="border-b border-gray-800 lg:border-none py-4 lg:py-0">
        <button 
          className="w-full flex justify-between items-center lg:cursor-default lg:pointer-events-none text-left"
          onClick={() => toggleSection(title)}
        >
          <h3 className="text-white font-bold uppercase text-sm tracking-wider">{title}</h3>
          <span className="lg:hidden text-gray-400">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </button>
        <div className={`mt-4 lg:mt-6 transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
          <ul className="space-y-4 text-sm">
            {children}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800 mt-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Newsletter & App Download */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-12 border-b border-gray-800 mb-12">
          
          <div className="flex-1 max-w-xl w-full">
            <h3 className="text-white text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
            <p className="text-sm mb-4">Get the latest updates on new products, upcoming sales, exclusive offers and marketplace news.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="w-full sm:flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6a00] transition-colors"
                required
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-[#ff6a00] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>

          <div className="flex flex-col items-center lg:items-end w-full lg:w-auto mt-6 lg:mt-0">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Download Our App</h3>
            <div className="flex gap-4">
              <a href="#" onClick={(e) => handleComingSoon(e, 'iOS App')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-3 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
              </a>
              <a href="#" onClick={(e) => handleComingSoon(e, 'Android App')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-3 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-0 lg:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-2 pr-0 lg:pr-8 mb-8 lg:mb-0">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter block mb-6">
              VERTEX<span className="text-[#ff6a00]">.</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              The premier AI-powered enterprise marketplace for global commerce. Redefining how businesses and customers interact with next-generation technology.
            </p>
            
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#ff6a00] mt-0.5 shrink-0" size={16} /> 
                <span>123 Enterprise Tower, Tech District, NY 10001</span>
              </div>
              <a href="mailto:support@vertexmarket.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <FiMail className="text-[#ff6a00] shrink-0" size={16} /> 
                <span>support@vertexmarket.com</span>
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-3 hover:text-white transition-colors">
                <FiPhone className="text-[#ff6a00] shrink-0" size={16} /> 
                <span>+1 (800) 123-4567</span>
              </a>
            </div>
          </div>

          {/* Collapsible Sections for Mobile / Grid for Desktop */}
          <FooterSection title="Company">
            <li><Link to="/about" className="hover:text-[#ff6a00] transition-colors">About</Link></li>
            <li><Link to="/careers" className="hover:text-[#ff6a00] transition-colors">Careers</Link></li>
            <li><Link to="/press" className="hover:text-[#ff6a00] transition-colors">Press & Media</Link></li>
            <li><Link to="/blog" className="hover:text-[#ff6a00] transition-colors">Tech Blog</Link></li>
          </FooterSection>

          <FooterSection title="Support">
            <li><Link to="/support" className="hover:text-[#ff6a00] transition-colors">Help Center</Link></li>
            <li><Link to="/support" className="hover:text-[#ff6a00] transition-colors">Contact Us</Link></li>
            <li><Link to="/returns" className="hover:text-[#ff6a00] transition-colors">Return Policy</Link></li>
            <li><Link to="/support" className="hover:text-[#ff6a00] transition-colors">FAQ</Link></li>
          </FooterSection>

          <FooterSection title="Seller">
            <li><Link to="/become-seller" className="hover:text-[#ff6a00] transition-colors">Become a Seller</Link></li>
            <li><Link to="/seller" className="hover:text-[#ff6a00] transition-colors">Seller Center</Link></li>
            <li><Link to="/seller-policy" className="hover:text-[#ff6a00] transition-colors">Seller Policy</Link></li>
          </FooterSection>

          <FooterSection title="Legal">
            <li><Link to="/privacy" className="hover:text-[#ff6a00] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#ff6a00] transition-colors">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-[#ff6a00] transition-colors">Cookies</Link></li>
          </FooterSection>

        </div>

        {/* Bottom Bar: Trust Badges & Payment */}
        <div className="pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <div className="flex items-center gap-2">
              <FiLock className="text-blue-500 text-xl" />
              <div className="text-xs">
                <div className="text-white font-bold uppercase tracking-wider">Secure Checkout</div>
                <div>Protected Payments</div>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <FiShield className="text-green-500 text-xl" />
              <div className="text-xs">
                <div className="text-white font-bold uppercase tracking-wider">Buyer Protection</div>
                <div>Guaranteed Returns</div>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <FiAward className="text-yellow-500 text-xl" />
              <div className="text-xs">
                <div className="text-white font-bold uppercase tracking-wider">Verified Sellers</div>
                <div>Authentic Products</div>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-3">
             <span className="text-xs uppercase tracking-wider font-bold mr-2">We Accept:</span>
             <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-black text-white">VISA</div>
             <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-black text-white">MASTERCARD</div>
             <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-black text-white">STRIPE</div>
             <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-black text-white">PAYPAL</div>
          </div>
        </div>

        {/* Copyright & Localization */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
          <div>
            &copy; {currentYear} Vertex Market. Crafted with precision for enterprise commerce.
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={(e) => handleComingSoon(e, 'Localization settings')} className="flex items-center gap-2 hover:text-white transition-colors">
              <span className="text-lg">🇺🇸</span>
              <span>United States / USD</span>
            </button>
            <div className="w-px h-4 bg-gray-800"></div>
            <button onClick={(e) => handleComingSoon(e, 'Language settings')} className="flex items-center gap-2 hover:text-white transition-colors">
              <span>English</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
