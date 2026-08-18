import { useState, useRef, useEffect } from 'react'
import AIHeader from './AIHeader'
import AIInput from './AIInput'
import AIMessageList from './AIMessageList'
import AISettingsPanel from './AISettingsPanel'
import AIHistorySidebar from './AIHistorySidebar'
import VoiceSearchModal from './VoiceSearchModal'
import ImageSearchModal from './ImageSearchModal'
import { useAI } from '../../context/AIContext'

const AIChatPanel = () => {
  const { isOpen } = useAI()
  const [view, setView] = useState('chat') // 'chat', 'settings', 'history'
  const [showVoice, setShowVoice] = useState(false)
  const [showImage, setShowImage] = useState(false)

  // Prevents scrolling on the body when panel is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset view when closed
      setTimeout(() => setView('chat'), 300)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
        aria-hidden="true"
      />

      {/* Main Panel */}
      <div className="fixed inset-0 md:inset-auto md:bottom-28 md:right-8 z-50 flex flex-col bg-white md:rounded-2xl shadow-2xl md:w-[400px] lg:w-[450px] md:h-[600px] max-h-screen md:max-h-[85vh] overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-5 md:zoom-in-95 duration-300">
        
        <AIHeader 
          onSettingsClick={() => setView(view === 'settings' ? 'chat' : 'settings')} 
          onHistoryClick={() => setView(view === 'history' ? 'chat' : 'history')} 
        />

        <div className="flex-1 relative overflow-hidden flex flex-col bg-gray-50/30">
          
          {/* Main Chat View */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${view === 'chat' ? 'translate-x-0' : '-translate-x-full'}`}>
            <AIMessageList />
          </div>

          {/* Settings Overlay */}
          <div className={`absolute inset-0 bg-white transition-transform duration-300 z-10 ${view === 'settings' ? 'translate-x-0' : 'translate-x-full'}`}>
            <AISettingsPanel onBack={() => setView('chat')} />
          </div>

          {/* History Overlay */}
          <div className={`absolute inset-0 bg-white transition-transform duration-300 z-10 ${view === 'history' ? 'translate-x-0' : '-translate-x-full'}`}>
            <AIHistorySidebar onBack={() => setView('chat')} />
          </div>

        </div>

        <AIInput 
          onVoiceClick={() => setShowVoice(true)} 
          onImageClick={() => setShowImage(true)} 
        />

      </div>

      {/* Modals */}
      <VoiceSearchModal isOpen={showVoice} onClose={() => setShowVoice(false)} />
      <ImageSearchModal isOpen={showImage} onClose={() => setShowImage(false)} />
    </>
  )
}

export default AIChatPanel
