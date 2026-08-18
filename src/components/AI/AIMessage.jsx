import { useState } from 'react'
import { FiCopy, FiRefreshCw, FiThumbsUp, FiThumbsDown, FiCheck } from 'react-icons/fi'
import SuggestionChips from './SuggestionChips'
import RecommendedProducts from './RecommendedProducts'
import ComparisonCard from './ComparisonCard'
import { useAI } from '../../context/AIContext'

const AIMessage = ({ message }) => {
  const { sender, text, type, products, comparisonData, suggestions, timestamp } = message
  const isAI = sender === 'ai'
  const { sendMessage } = useAI()
  
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'like', 'dislike'

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex gap-3 max-w-[90%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
      
      {/* Avatar */}
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff6a00] to-orange-400 p-[1px] shrink-0 mt-1">
          <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Vertex&backgroundColor=ffffff" alt="AI" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-full min-w-0`}>
        
        {/* Main Bubble */}
        <div className={`p-4 rounded-2xl shadow-sm break-words ${
          isAI 
            ? 'bg-white border border-gray-100 rounded-tl-sm text-gray-800' 
            : 'bg-[#ff6a00] text-white rounded-tr-sm'
        }`}>
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>

        {/* Dynamic Content based on Type */}
        {isAI && type === 'recommendation' && products && (
          <div className="mt-3 w-full">
            <RecommendedProducts products={products} />
          </div>
        )}

        {isAI && type === 'comparison' && comparisonData && (
          <div className="mt-3 w-full">
            <ComparisonCard data={comparisonData} />
          </div>
        )}
        
        {isAI && type === 'order' && message.orderData && (
          <div className="mt-3 w-full bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">Order Tracking</h4>
            <div className="text-sm">
              <span className="text-gray-500 block mb-1">Status:</span>
              <span className="font-semibold text-[#ff6a00] uppercase tracking-wider">{message.orderData.status}</span>
            </div>
          </div>
        )}

        {isAI && type === 'stores' && message.storeData && (
          <div className="mt-3 w-full flex flex-col gap-2">
            {message.storeData.map((store, i) => (
              <div key={i} className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm gap-3">
                {store.storeLogo && <img src={store.storeLogo} alt={store.storeName} className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{store.storeName}</h4>
                  <p className="text-xs text-gray-500">Rating: {store.storeRating || 5.0} • {store.followers || 0} followers</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isAI && type === 'support_link' && message.actionLink && (
          <div className="mt-3">
             <a href={message.actionLink.url} className="inline-block px-4 py-2 bg-[#ff6a00] text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
               {message.actionLink.label}
             </a>
          </div>
        )}

        {/* Metadata & Actions */}
        <div className={`flex items-center gap-3 mt-1.5 px-1 ${isAI ? 'justify-start' : 'justify-end'}`}>
          <span className="text-[11px] text-gray-400">{timeString}</span>
          
          {isAI && (
            <div className="flex items-center gap-1">
              <button 
                onClick={handleCopy}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                title="Copy"
              >
                {copied ? <FiCheck className="text-green-500" /> : <FiCopy className="text-[12px]" />}
              </button>
              <button 
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                title="Regenerate"
              >
                <FiRefreshCw className="text-[12px]" />
              </button>
              <button 
                onClick={() => setFeedback('like')}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors focus:outline-none ${feedback === 'like' ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                title="Good response"
              >
                <FiThumbsUp className="text-[12px]" />
              </button>
              <button 
                onClick={() => setFeedback('dislike')}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors focus:outline-none ${feedback === 'dislike' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                title="Bad response"
              >
                <FiThumbsDown className="text-[12px]" />
              </button>
            </div>
          )}
        </div>

        {/* Follow-up Suggestions */}
        {isAI && suggestions && suggestions.length > 0 && (
          <div className="mt-3">
            <SuggestionChips suggestions={suggestions} />
          </div>
        )}

      </div>
    </div>
  )
}

export default AIMessage
