import { FiArrowLeft, FiTrash2, FiMoon, FiGlobe } from 'react-icons/fi'
import { useAI } from '../../context/AIContext'
import toast from 'react-hot-toast'
import ConfirmModal from '../common/ConfirmModal'
import { useState } from 'react'

const AISettingsPanel = ({ onBack }) => {
  const { clearHistory } = useAI()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearHistory = () => {
    clearHistory()
    setShowConfirm(false)
    toast.success('All chat history cleared')
  }

  const handlePlaceholderAction = (action) => {
    toast.success(`${action} feature is under development!`, { icon: '🚧' })
  }

  return (
    <div className="flex flex-col h-full bg-white z-20">
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <h3 className="text-[16px] font-bold text-gray-900">Assistant Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Model info */}
        <div>
          <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">AI Model</h4>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handlePlaceholderAction('Model Selection')}>
            <div>
              <p className="text-[14px] font-bold text-gray-900">Vertex AI Mini</p>
              <p className="text-[12px] text-gray-500">Fast and optimized for shopping</p>
            </div>
            <span className="text-[10px] bg-[#ff6a00]/10 text-[#ff6a00] px-2 py-1 rounded-full font-bold">Default</span>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Preferences</h4>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => handlePlaceholderAction('Theme Toggle')}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FiMoon /></div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-gray-900">Dark Mode</p>
                <p className="text-[12px] text-gray-500">System default</p>
              </div>
            </button>
            <button 
              onClick={() => handlePlaceholderAction('Language Change')}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FiGlobe /></div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-gray-900">Language</p>
                <p className="text-[12px] text-gray-500">English (US)</p>
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <button 
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl text-[14px] font-bold hover:bg-red-100 transition-colors focus:outline-none"
          >
            <FiTrash2 /> Clear All History
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClearHistory}
        title="Clear History"
        message="This will permanently delete all your AI chat history. This action cannot be undone."
        confirmText="Clear History"
        confirmColor="bg-red-500"
      />
    </div>
  )
}

export default AISettingsPanel
