import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';
import AddressCard from './AddressCard';
import AddressModal from './AddressModal';

const ShippingAddress = () => {
  const { addresses, selectedAddressId, setCurrentStep } = useCheckout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    if (selectedAddressId) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-1 text-sm font-semibold text-[#ff6a00] hover:text-[#e65c00]"
        >
          <FiPlus /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(address => (
          <AddressCard 
            key={address.id} 
            address={address} 
            onEdit={handleEdit}
          />
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No shipping addresses found.</p>
          <button 
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            <FiPlus /> Add Your First Address
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedAddressId}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-colors ${
            selectedAddressId 
              ? 'bg-[#ff6a00] hover:bg-[#e65c00]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue to Delivery
        </button>
      </div>

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        editAddress={editingAddress}
      />
    </div>
  );
};

export default ShippingAddress;
