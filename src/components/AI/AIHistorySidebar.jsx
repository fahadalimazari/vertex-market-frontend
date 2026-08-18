import { FiArrowLeft, FiTrash2, FiSearch, FiMessageSquare } from 'react-icons/fi'
import { useAI } from '../../context/AIContext'
import { useState } from 'react'
import ConfirmModal from '../common/ConfirmModal'

const AIHistorySidebar = ({ onBack }) => {
  const { history, loadChatFromHistory, deleteChatFromHistory } = useAI()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const filteredHistory = history.filter(session => 
    session.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (id) => {
    loadChatFromHistory(id)
    onBack()
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
        <h3 className="text-[16px] font-bold text-gray-900">Chat History</h3>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search past conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[13px] transition-colors focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-[13px]">
            No conversations found.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredHistory.map(session => (
              <div 
                key={session.id}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSelect(session.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6a00] flex items-center justify-center shrink-0">
                    <FiMessageSquare className="text-[14px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{session.preview}</p>
                    <p className="text-[11px] text-gray-400">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteId(session.id)
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:outline-none shrink-0"
                  title="Delete Chat"
                >
                  <FiTrash2 className="text-[14px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteChatFromHistory(deleteId)
          setDeleteId(null)
        }}
        title="Delete Conversation"
        message="Are you sure you want to delete this chat history?"
        confirmText="Delete"
        confirmColor="bg-red-500"
      />
    </div>
  )
}

export default AIHistorySidebar
