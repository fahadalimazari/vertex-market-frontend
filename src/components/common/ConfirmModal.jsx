import Modal from './Modal'
import { FiAlertTriangle } from 'react-icons/fi'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'bg-[#ff6a00]' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
          <FiAlertTriangle />
        </div>
        <p className="text-[14px] text-gray-500 mb-8">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`w-full text-white py-3.5 rounded-xl text-[14px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${confirmColor} hover:brightness-95`}
          >
            {confirmText}
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
