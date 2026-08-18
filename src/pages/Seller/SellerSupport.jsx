import { FiLifeBuoy, FiSearch, FiMessageSquare } from 'react-icons/fi';

const SellerSupport = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiLifeBuoy className="text-[#ff6a00]" /> Seller Support Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Get help from Vertex Marketplace Support.</p>
        </div>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-1 sm:p-2 transition-colors">
          <FiMessageSquare /> Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Tickets */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900">Your Support Tickets</h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search tickets..." className="pl-9 pr-4 py-1.5 border rounded-lg text-xs outline-none" />
            </div>
          </div>
          <div className="p-8 text-center text-gray-500">
            <FiLifeBuoy className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900">No active support tickets</p>
            <p className="text-xs mt-1">Need help? Open a new ticket.</p>
          </div>
        </div>

        {/* Knowledge Base Quick Links */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <h3 className="font-bold text-orange-900 mb-4">Helpful Resources</h3>
          <div className="space-y-3">
            {['How to add dynamic products', 'Understanding payout schedules', 'Handling returns effectively', 'Improving Store SEO'].map((link, i) => (
              <a key={i} href="#" className="block text-sm text-orange-700 hover:text-[#ff6a00] hover:underline font-semibold">
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerSupport;
