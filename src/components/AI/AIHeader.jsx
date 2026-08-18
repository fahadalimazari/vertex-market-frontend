import { FiSettings, FiX, FiRefreshCcw } from 'react-icons/fi'
import { useAI } from '../../context/AIContext'

const AIHeader = ({ onSettingsClick, onHistoryClick }) => {
  const { setIsOpen, clearChat } = useAI()

  return (
    <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff6a00] to-orange-400 p-[2px]">
            <div className="w-full h-full bg-white rounded-full overflow-hidden border-2 border-white flex items-center justify-center">
              <img 
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Vertex&backgroundColor=ffffff" 
                alt="AI Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 leading-tight">Vertex AI</h3>
          <p className="text-[12px] text-gray-500">Your Shopping Assistant</p>
          <p className="text-[10px] text-green-500 font-medium">Online / Ready to help</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={clearChat}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
          title="New Chat"
        >
          <FiRefreshCcw className="text-[15px]" />
        </button>
        <button 
          onClick={onSettingsClick}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
          title="Settings"
        >
          <FiSettings className="text-[15px]" />
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none ml-1"
          title="Close Panel"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>
  )
}

export default AIHeader
