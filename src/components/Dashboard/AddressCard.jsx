import { FiHome, FiBriefcase, FiMapPin, FiCheckCircle } from 'react-icons/fi'

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  const getIcon = () => {
    switch(address.title.toLowerCase()) {
      case 'home': return <FiHome />
      case 'office': return <FiBriefcase />
      default: return <FiMapPin />
    }
  }

  return (
    <div className={`relative bg-white border-2 rounded-3xl p-6 transition-all shadow-sm flex flex-col h-full ${address.isDefault ? 'border-[#ff6a00]' : 'border-gray-100 hover:border-gray-200'}`}>
      
      {address.isDefault && (
        <div className="absolute -top-3 -right-3 bg-[#ff6a00] text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1">
          <FiCheckCircle /> Default
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${address.isDefault ? 'bg-orange-50 text-[#ff6a00]' : 'bg-gray-50 text-gray-500'}`}>
          {getIcon()}
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900">{address.title}</h3>
          <p className="text-[13px] text-gray-500">{address.name}</p>
        </div>
      </div>

      <div className="flex-1 text-[14px] text-gray-600 mb-6 space-y-1">
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p className="mt-2 font-medium text-gray-900">{address.phone}</p>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
        <button 
          onClick={() => onEdit(address)}
          className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-[13px] font-bold hover:bg-gray-100 transition-colors focus:outline-none"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(address.id)}
          className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl text-[13px] font-bold hover:bg-red-100 transition-colors focus:outline-none"
        >
          Delete
        </button>
      </div>

      {!address.isDefault && (
        <button 
          onClick={() => onSetDefault(address.id)}
          className="w-full mt-3 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl text-[13px] font-bold hover:border-[#ff6a00] hover:text-[#ff6a00] transition-colors focus:outline-none"
        >
          Set as Default
        </button>
      )}
    </div>
  )
}

export default AddressCard
