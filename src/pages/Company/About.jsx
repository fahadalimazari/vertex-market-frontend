import { FiSearch, FiShield, FiTrendingUp, FiShoppingBag, FiUsers, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">About Vertex Market</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          The next generation AI-powered marketplace connecting customers, sellers and brands.
        </p>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Vertex Market is designed to redefine global commerce by introducing AI-driven product discovery and an enterprise-level seller ecosystem. Our mission is to create a trusted environment where customers find precisely what they need, and sellers have the ultimate toolkit to scale their operations efficiently.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <FiSearch className="text-4xl text-[#ff6a00] mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered Discovery</h3>
            <p className="text-sm text-gray-500">Smart recommendations that learn what you love.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <FiAward className="text-4xl text-[#ff6a00] mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Trusted Sellers</h3>
            <p className="text-sm text-gray-500">Shop confidently from our network of verified brands.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <FiShield className="text-4xl text-[#ff6a00] mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Secure Shopping</h3>
            <p className="text-sm text-gray-500">Protected payments and comprehensive buyer protection.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <FiTrendingUp className="text-4xl text-[#ff6a00] mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-sm text-gray-500">Find exactly what you need with our personalized engine.</p>
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Customer Workflow */}
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8">
            <FiShoppingBag className="text-[#ff6a00]" /> How Vertex Market Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gray-100 font-bold flex items-center justify-center shrink-0">1</div><p className="font-medium text-gray-700 mt-1">Discover Products & Compare</p></div>
            <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gray-100 font-bold flex items-center justify-center shrink-0">2</div><p className="font-medium text-gray-700 mt-1">Add to Cart & Secure Checkout</p></div>
            <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gray-100 font-bold flex items-center justify-center shrink-0">3</div><p className="font-medium text-gray-700 mt-1">Track Order Delivery</p></div>
          </div>
        </div>

        {/* Seller Workflow */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-10 rounded-3xl border border-gray-800 text-white shadow-lg">
          <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
            <FiUsers className="text-[#ff6a00]" /> For Sellers
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gray-800 font-bold flex items-center justify-center shrink-0">1</div><p className="font-medium text-gray-300 mt-1">Submit Seller Application & Wait for Admin Approval</p></div>
            <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gray-800 font-bold flex items-center justify-center shrink-0">2</div><p className="font-medium text-gray-300 mt-1">Add Products & Manage Inventory</p></div>
            <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gray-800 font-bold flex items-center justify-center shrink-0">3</div><p className="font-medium text-gray-300 mt-1">Receive Orders & Grow Store</p></div>
          </div>
          <Link to="/become-seller" className="mt-8 inline-block bg-[#ff6a00] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Open Your Store Today
          </Link>
        </div>

      </section>
      
    </div>
  );
};

export default About;
