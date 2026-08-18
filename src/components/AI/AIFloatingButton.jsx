import { FiMessageSquare, FiX } from 'react-icons/fi'
import { useAI } from '../../context/AIContext'
import { FaRobot } from 'react-icons/fa'

const AIFloatingButton = () => {
  const { isOpen, setIsOpen } = useAI()

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 h-12 px-4 sm:h-14 sm:px-5 rounded-full flex items-center justify-center space-x-1.5 sm:space-x-2 text-white shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/30 hover:scale-105 ${
        isOpen ? 'bg-gray-900 w-12 sm:w-14 !px-0' : 'bg-gradient-to-r from-[#ff6a00] to-[#ff4747]'
      }`}
      aria-label="Toggle AI Assistant"
    >
      {isOpen ? (
        <FiX className="text-xl sm:text-2xl transition-transform duration-300" />
      ) : (
        <>
          <FaRobot className="text-lg sm:text-xl" />
          <span className="font-bold text-xs sm:text-sm tracking-wide">Vertex AI</span>
        </>
      )}
    </button>
  )
}

export default AIFloatingButton
