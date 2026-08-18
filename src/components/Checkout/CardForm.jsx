import { useState, useEffect } from 'react';
import { useCheckout } from '../../hooks/useCheckout';

const CardForm = () => {
  const { paymentDetails, setPaymentDetails } = useCheckout();
  
  const [formData, setFormData] = useState({
    cardNumber: paymentDetails?.cardNumber || '',
    cardHolder: paymentDetails?.cardHolder || '',
    expiry: paymentDetails?.expiry || '',
    cvv: paymentDetails?.cvv || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Basic formatting
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2, 4)}`;
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  useEffect(() => {
    setPaymentDetails(formData);
  }, [formData, setPaymentDetails]);

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input 
            type="text" 
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
          <input 
            type="text" 
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="Name on card"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input 
              type="text" 
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input 
              type="password" 
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardForm;
