export const deliveryMethods = [
  { id: 'standard', name: 'Standard Delivery', estimatedDays: '3-5 Days', price: 150 },
  { id: 'express', name: 'Express Delivery', estimatedDays: '1-2 Days', price: 500 },
  { id: 'sameday', name: 'Same Day Delivery', estimatedDays: 'Today', price: 1000 },
]

export const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: 'FiBox' },
  { id: 'card', name: 'Credit / Debit Card', icon: 'FiCreditCard' },
  { id: 'jazzcash', name: 'JazzCash', icon: 'FiSmartphone' },
  { id: 'easypaisa', name: 'EasyPaisa', icon: 'FiSmartphone' },
  { id: 'bank', name: 'Bank Transfer', icon: 'FiBriefcase' },
]

export const savedAddresses = [
  {
    id: 'addr_1',
    fullName: 'Fahad Mazari',
    phone: '0300-1234567',
    addressLine1: 'House 123, Street 4, Sector F-10/2',
    city: 'Islamabad',
    state: 'Capital Territory',
    zip: '44000',
    isDefault: true,
  },
  {
    id: 'addr_2',
    fullName: 'Fahad Mazari',
    phone: '0300-1234567',
    addressLine1: 'Office 405, 4th Floor, Arfa Tech Park',
    city: 'Lahore',
    state: 'Punjab',
    zip: '54000',
    isDefault: false,
  }
];

export const coupons = {
  SAVE10: { code: 'SAVE10', type: 'percentage', value: 10, minPurchase: 1000 },
  WELCOME: { code: 'WELCOME', type: 'fixed', value: 500, minPurchase: 2000 },
  FIRSTORDER: { code: 'FIRSTORDER', type: 'percentage', value: 15, minPurchase: 1500 },
  AI20: { code: 'AI20', type: 'percentage', value: 20, minPurchase: 5000 },
};
