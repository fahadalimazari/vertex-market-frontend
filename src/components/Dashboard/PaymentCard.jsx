import { FiCreditCard, FiTrash2, FiCheckCircle } from 'react-icons/fi'

const PaymentCard = ({ payment, onDelete, onSetDefault }) => {
  return (
    <div className={`relative bg-white border-2 rounded-3xl p-6 transition-all shadow-sm flex flex-col h-full ${payment.isDefault ? 'border-[#ff6a00]' : 'border-gray-100 hover:border-gray-200'}`}>
      
      {payment.isDefault && (
        <div className="absolute -top-3 -right-3 bg-[#ff6a00] text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1">
          <FiCheckCircle /> Default
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-xl text-gray-400">
          <FiCreditCard />
        </div>
        <button 
          onClick={() => onDelete(payment.id)}
          className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
        >
          <FiTrash2 className="text-[14px]" />
        </button>
      </div>

      <div className="flex-1 mb-6">
        <p className="text-[18px] font-bold text-gray-900 tracking-widest mb-1">{payment.cardNumber}</p>
        <div className="flex items-center justify-between text-[13px] text-gray-500">
          <span>{payment.nameOnCard}</span>
          <span>Exp: {payment.expiryDate}</span>
        </div>
      </div>

      {!payment.isDefault && (
        <button 
          onClick={() => onSetDefault(payment.id)}
          className="w-full mt-auto bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl text-[13px] font-bold hover:border-[#ff6a00] hover:text-[#ff6a00] transition-colors focus:outline-none"
        >
          Set as Default
        </button>
      )}
    </div>
  )
}

export default PaymentCard
