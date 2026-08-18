import { useState } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, isCancelling }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiAlertTriangle className="text-red-500" /> Cancel Order
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to cancel this order? This action cannot be undone. If you have already paid, a refund will be initiated automatically to your original payment method.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isCancelling}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Keep Order
            </button>
            <button
              onClick={onConfirm}
              disabled={isCancelling}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isCancelling ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Yes, Cancel Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
