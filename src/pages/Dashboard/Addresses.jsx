import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AddressCard from '../../components/Dashboard/AddressCard'
import AddressModal from '../../components/Dashboard/AddressModal'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useDashboard } from '../../context/Dashboard/DashboardContext'

const Addresses = () => {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useDashboard()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  
  const [deleteId, setDeleteId] = useState(null)

  const handleAddNew = () => {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  const handleSave = (addressData) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addressData)
      toast.success('Address updated successfully')
    } else {
      addAddress(addressData)
      toast.success('Address added successfully')
    }
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      removeAddress(deleteId)
      toast.success('Address deleted successfully')
      setDeleteId(null)
    }
  }

  const handleSetDefault = (id) => {
    setDefaultAddress(id)
    toast.success('Default address updated')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#ff6a00] text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2"
        >
          <FiPlus className="text-lg" />
          <span className="hidden sm:inline">Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map(address => (
          <AddressCard 
            key={address.id} 
            address={address} 
            onEdit={handleEdit}
            onDelete={setDeleteId}
            onSetDefault={handleSetDefault}
          />
        ))}
        {addresses.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-gray-100 rounded-3xl border-dashed">
            <p className="text-gray-500 mb-4">You haven't added any addresses yet.</p>
            <button 
              onClick={handleAddNew}
              className="text-[#ff6a00] font-bold hover:underline"
            >
              Add your first address
            </button>
          </div>
        )}
      </div>

      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingAddress={editingAddress}
      />

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        confirmColor="bg-red-500"
      />
    </div>
  )
}

export default Addresses
