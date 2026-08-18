import { useEffect, useRef } from 'react'
import AIMessage from './AIMessage'
import SuggestionChips from './SuggestionChips'
import { useAI } from '../../context/AIContext'
import { aiResponses } from '../../data/aiResponses'
import { FiMessageSquare } from 'react-icons/fi'

const AIMessageList = () => {
  const { messages, isTyping, loadingStep, currentProductContext } = useAI()
  const listRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isTyping, loadingStep])

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
      
      {/* Welcome Screen (Empty State) */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#ff6a00] text-2xl mb-4">
            <FiMessageSquare />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hi! I'm Vertex AI 👋</h2>
          <p className="text-[14px] text-gray-500 mb-8 max-w-xs">
            What are you looking for today?
          </p>
          
          <div className="w-full max-w-sm">
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3 text-left">
              {currentProductContext ? "About this product" : "Quick Actions"}
            </h3>
            <SuggestionChips 
              suggestions={
                currentProductContext 
                ? ["Is this worth buying?", "Pros & Cons", "Compare Similar Products", "Best Alternatives"]
                : ["🔎 Find Products", "🔥 Today's Deals", "🤖 Recommend For Me", "⚖ Compare Products", "📦 Track Order", "↩ Returns & Refunds", "🏪 Top Stores", "💬 Contact Support"]
              } 
            />
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg) => (
        <AIMessage key={msg.id} message={msg} />
      ))}

      {/* Typing / Loading Indicator */}
      {isTyping && (
        <div className="flex gap-3 max-w-[85%] self-start animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff6a00] to-orange-400 p-[1px] shrink-0">
            <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Vertex&backgroundColor=ffffff" alt="AI" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
              <span className="text-[12px] font-medium text-gray-500 ml-2">{loadingStep}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIMessageList
