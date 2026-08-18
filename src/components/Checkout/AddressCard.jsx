import { FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';

const AddressCard = ({ address, onEdit }) => {
  const { selectedAddressId, setSelectedAddressId, checkoutService } = useCheckout();
  const isSelected = selectedAddressId === address.id;

  return (
    <div 
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedAddressId(address.id)}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-[#ff6a00]">
          <FiCheckCircle size={24} />
        </div>
      )}
      
      <div className="flex flex-col gap-1 pr-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{address.fullName}</span>
          {address.isDefault && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gray-900 rounded-md">
              Default
            </span>
          )}
        </div>
        
        <span className="text-sm text-gray-600">{address.phone}</span>
        <span className="text-sm text-gray-600 mt-2">{address.addressLine1}</span>
        <span className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</span>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="text-sm font-semibold text-[#ff6a00] hover:text-[#e65c00] flex items-center gap-1"
        >
          <FiEdit2 /> Edit
        </button>
        {/* We can add delete later if needed, but per requirements we just need Address CRUD to work. The service handles delete. */}
      </div>
    </div>
  );
};

export default AddressCard;
