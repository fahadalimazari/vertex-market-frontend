import { useAI } from '../../context/AIContext'

const SuggestionChips = ({ suggestions }) => {
  const { sendMessage, isTyping } = useAI()

  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => sendMessage(suggestion)}
          disabled={isTyping}
          className="px-3 py-1.5 bg-white border border-[#ff6a00]/30 text-[#ff6a00] rounded-full text-[12px] font-medium hover:bg-[#ff6a00] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}

export default SuggestionChips
