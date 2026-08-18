import { FiBriefcase } from 'react-icons/fi';

const Careers = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Build the Future of Commerce</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Join Vertex Market and help build next-generation marketplace technology.
        </p>
      </section>

      {/* Open Positions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
          <FiBriefcase className="text-[#ff6a00]" /> Open Positions
        </h2>
        
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No open positions right now.</h3>
          <p className="text-gray-500 mb-6">
            We are currently not actively hiring, but check back soon for new opportunities in Engineering, AI, and Product Design.
          </p>
          <a href="mailto:careers@vertexmarket.com" className="inline-block border-2 border-gray-200 text-gray-700 hover:border-[#ff6a00] hover:text-[#ff6a00] font-bold py-3 px-8 rounded-xl transition-all">
            Contact Careers Team
          </a>
        </div>
      </section>
      
    </div>
  );
};

export default Careers;
