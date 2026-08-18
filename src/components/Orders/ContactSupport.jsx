import { FiMail, FiMessageCircle, FiPhoneCall } from 'react-icons/fi';

const ContactSupport = () => {
  return (
    <div className="bg-gray-900 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff6a00] rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <h2 className="text-3xl font-black mb-4">Still need help?</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            If you couldn't find the answer to your question in our Help Center, our dedicated support team is available 24/7 to assist you with any issues.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-5 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-sm transition-colors">
              <FiMessageCircle className="text-[#ff6a00]" /> Open Support Ticket
            </button>
            <button className="flex items-center gap-2 px-5 py-3 border border-gray-700 text-white hover:bg-gray-800 rounded-xl font-bold text-sm transition-colors">
              <FiPhoneCall className="text-gray-400" /> Request Callback
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <FiMail className="text-2xl text-[#ff6a00] mb-3" />
            <h4 className="font-bold mb-1 text-sm">Email Support</h4>
            <p className="text-xs text-gray-400">support@vertexmarket.com</p>
            <p className="text-[10px] text-green-400 mt-2 font-bold uppercase tracking-wider">Replies in 2 hrs</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <FiPhoneCall className="text-2xl text-[#ff6a00] mb-3" />
            <h4 className="font-bold mb-1 text-sm">Phone Support</h4>
            <p className="text-xs text-gray-400">+1 (800) 123-4567</p>
            <p className="text-[10px] text-green-400 mt-2 font-bold uppercase tracking-wider">Available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
