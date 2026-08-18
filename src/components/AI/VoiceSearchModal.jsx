import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import { FiMic, FiMoreHorizontal } from 'react-icons/fi'
import { useAI } from '../../context/AIContext'

const VoiceSearchModal = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('listening') // listening, processing, done
  const { sendMessage } = useAI()

  useEffect(() => {
    if (isOpen) {
      setPhase('listening')
      
      // Simulate listening for 2.5s
      const timer1 = setTimeout(() => {
        setPhase('processing')
        
        // Simulate processing for 1.5s
        const timer2 = setTimeout(() => {
          setPhase('done')
          onClose()
          
          // Trigger a dummy voice query
          sendMessage("Compare iPhone vs Samsung")
        }, 1500)
        
        return () => clearTimeout(timer2)
      }, 2500)
      
      return () => clearTimeout(timer1)
    }
  }, [isOpen, sendMessage, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Voice Search" maxWidth="max-w-sm">
      <div className="flex flex-col items-center justify-center py-8">
        
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl z-10 relative transition-colors duration-300 ${phase === 'listening' ? 'bg-[#ff6a00]' : 'bg-gray-800'}`}>
            <FiMic />
          </div>
          
          {phase === 'listening' && (
            <>
              <div className="absolute inset-0 bg-[#ff6a00]/30 rounded-full animate-ping"></div>
              <div className="absolute inset-[-15px] bg-[#ff6a00]/20 rounded-full animate-pulse"></div>
            </>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {phase === 'listening' && 'Listening...'}
          {phase === 'processing' && 'Processing...'}
          {phase === 'done' && 'Done!'}
        </h3>
        <p className="text-[14px] text-gray-500 text-center">
          {phase === 'listening' && 'Speak now to search or ask questions.'}
          {phase === 'processing' && 'Converting your speech to text...'}
          {phase === 'done' && 'Sending to Assistant...'}
        </p>
      </div>
    </Modal>
  )
}

export default VoiceSearchModal
