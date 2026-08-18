import { useState } from 'react'
import Modal from '../common/Modal'
import { FiCamera, FiUploadCloud, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ImageSearchModal = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('upload') // upload, analyzing

  const handleUploadClick = () => {
    // In a real app, this would trigger an <input type="file" />
    setPhase('analyzing')
    
    setTimeout(() => {
      onClose()
      setPhase('upload')
      toast.success('Visual Search API is under development!', { icon: '📸' })
    }, 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visual Search" maxWidth="max-w-md">
      <div className="flex flex-col items-center justify-center py-4">
        
        {phase === 'upload' ? (
          <>
            <div 
              onClick={handleUploadClick}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:text-[#ff6a00] hover:border-[#ff6a00] hover:bg-orange-50 transition-all cursor-pointer mb-6"
            >
              <FiUploadCloud className="text-4xl mb-3" />
              <h4 className="text-[15px] font-bold text-gray-900 mb-1">Click to upload an image</h4>
              <p className="text-[13px]">or drag and drop here</p>
            </div>
            
            <p className="text-[12px] text-gray-500 text-center max-w-xs">
              Upload a photo of a product to find visually similar items in our catalog.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                <FiCamera />
              </div>
              <div className="absolute inset-0 bg-[#ff6a00]/20 rounded-2xl animate-pulse"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#ff6a00] text-white flex items-center justify-center shadow-lg animate-bounce">
                <FiSearch className="text-[14px]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Analyzing Image...</h3>
            <p className="text-[13px] text-gray-500">Looking for visual matches</p>
          </div>
        )}

      </div>
    </Modal>
  )
}

export default ImageSearchModal
