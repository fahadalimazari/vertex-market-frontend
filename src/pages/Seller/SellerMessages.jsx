import { FiMessageSquare, FiSend, FiSearch } from 'react-icons/fi';

const SellerMessages = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FiMessageSquare className="text-[#ff6a00]" /> Customer Messages
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-1 overflow-hidden">
        
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none bg-gray-50" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition-colors bg-orange-50/50">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 text-sm">Ali Khan</h4>
                <span className="text-[10px] text-gray-400">10:42 AM</span>
              </div>
              <p className="text-xs text-gray-600 truncate">Is the warranty applicable in Lahore?</p>
            </div>
            <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 text-sm">Sara Ahmed</h4>
                <span className="text-[10px] text-gray-400">Yesterday</span>
              </div>
              <p className="text-xs text-gray-600 truncate">Thanks for the quick delivery!</p>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50/30">
          <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">Ali Khan</h3>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm max-w-[80%]">
                <p className="text-sm text-gray-700">Is the warranty applicable in Lahore?</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input type="text" placeholder="Type your reply..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50" />
              <button className="bg-[#ff6a00] hover:bg-[#e65c00] text-white p-3 rounded-xl transition-colors">
                <FiSend />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerMessages;
