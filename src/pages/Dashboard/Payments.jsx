import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import PaymentCard from '../../components/Dashboard/PaymentCard'
import PaymentModal from '../../components/Dashboard/PaymentModal'
import ConfirmModal from '../../components/common/ConfirmModal'
import { usePayments } from '../../context/Dashboard/usePayments'

const Payments = () => {
  const { payments, addPayment, removePayment, setDefaultPayment, loading } = usePayments()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const handleAddNew = () => {
    setIsModalOpen(true)
  }

  const handleSave = async (paymentData) => {
    try {
      await addPayment(paymentData)
      toast.success('Payment method added successfully')
    } catch (e) {
      toast.error('Failed to add payment method')
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await removePayment(deleteId)
        toast.success('Payment method removed')
      } catch (e) {
        toast.error('Failed to remove payment method')
      }
      setDeleteId(null)
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await setDefaultPayment(id)
      toast.success('Default payment method updated')
    } catch (e) {
      toast.error('Failed to set default method')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#ff6a00] text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2"
        >
          <FiPlus className="text-lg" />
          <span className="hidden sm:inline">Add New Card</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6a00] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading payment methods...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map(payment => (
            <PaymentCard 
              key={payment.id} 
              payment={payment} 
              onDelete={setDeleteId}
              onSetDefault={handleSetDefault}
            />
          ))}
          {payments.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-white border-2 border-gray-100 rounded-3xl border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPlus className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No payment methods saved</h3>
              <p className="text-gray-500 mb-6">Add a payment method to make checkout faster.</p>
              <button 
                onClick={handleAddNew}
                className="text-white bg-[#ff6a00] hover:bg-[#e65c00] px-6 py-2.5 rounded-xl font-bold transition-colors"
              >
                + Add Payment Method
              </button>
            </div>
          )}
        </div>
      )}

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Card"
        message="Are you sure you want to remove this payment method?"
        confirmText="Remove"
        confirmColor="bg-red-500"
      />
    </div>
  )
}

export default Payments
