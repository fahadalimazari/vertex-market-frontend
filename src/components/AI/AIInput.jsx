import { useState, useRef, useEffect } from 'react'
import { FiSend, FiMic, FiCamera } from 'react-icons/fi'
import { useAI } from '../../context/AIContext'

const AIInput = ({ onVoiceClick, onImageClick }) => {
  const [text, setText] = useState('')
  const { sendMessage, isTyping } = useAI()
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [text])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || isTyping) return
    sendMessage(text)
    setText('')
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-white border-t border-gray-100 p-4 shrink-0 rounded-b-2xl">
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-[#ff6a00] focus-within:bg-white transition-colors p-2 shadow-sm">
        
        <div className="flex gap-1 pb-1 px-1 shrink-0">
          <button 
            type="button"
            onClick={onImageClick}
            disabled={isTyping}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50"
            title="Search by Image"
          >
            <FiCamera className="text-[16px]" />
          </button>
          <button 
            type="button"
            onClick={onVoiceClick}
            disabled={isTyping}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50"
            title="Voice Search"
          >
            <FiMic className="text-[16px]" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          placeholder="Ask anything..."
          className="flex-1 max-h-[120px] min-h-[40px] py-2.5 px-2 bg-transparent text-[14px] text-gray-900 resize-none focus:outline-none disabled:opacity-50"
          rows={1}
        />

        <div className="pb-1 pr-1 shrink-0">
          <button 
            type="submit"
            disabled={!text.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors focus:outline-none ${
              text.trim() && !isTyping 
                ? 'bg-[#ff6a00] text-white shadow-sm hover:brightness-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend className="text-[15px] ml-0.5" />
          </button>
        </div>
      </form>
      
      <div className="text-center mt-3">
        <p className="text-[11px] text-gray-400">
          AI Assistant can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  )
}

export default AIInput
