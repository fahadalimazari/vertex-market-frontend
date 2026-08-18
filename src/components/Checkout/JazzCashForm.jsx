import { useState, useEffect } from 'react';
import { useCheckout } from '../../hooks/useCheckout';

const JazzCashForm = () => {
  const { paymentDetails, setPaymentDetails } = useCheckout();
  
  const [formData, setFormData] = useState({
    phoneNumber: paymentDetails?.phoneNumber || ''
  });

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 11);
    setFormData({ phoneNumber: value });
  };

  useEffect(() => {
    setPaymentDetails(formData);
  }, [formData, setPaymentDetails]);

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">JazzCash Mobile Number</label>
          <div className="relative">
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="03XX XXXXXXX"
              className="w-full px-4 py-2 pl-12 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
              +92
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Please ensure your JazzCash account is active. You will receive an MPIN prompt on your phone to complete the transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JazzCashForm;
