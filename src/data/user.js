export const userProfile = {
  id: "USR-001",
  fullName: "Fahad Mazari",
  email: "fahad@example.com",
  phone: "+92 300 1234567",
  dateOfBirth: "1995-08-15",
  gender: "Male",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fahad",
  joinDate: "2023-01-10",
  stats: {
    totalOrders: 42,
    pendingOrders: 2,
    completedOrders: 38,
    wishlistItems: 15
  }
}

export const savedAddresses = [
  {
    id: "ADDR-1",
    type: "Home",
    fullName: "Fahad Mazari",
    phone: "+92 300 1234567",
    address: "House 123, Street 4, Phase 5",
    city: "Karachi",
    province: "Sindh",
    postalCode: "75500",
    country: "Pakistan",
    isDefault: true
  },
  {
    id: "ADDR-2",
    type: "Office",
    fullName: "Fahad Mazari",
    phone: "+92 300 1234567",
    address: "Office 402, Business Center",
    city: "Karachi",
    province: "Sindh",
    postalCode: "75200",
    country: "Pakistan",
    isDefault: false
  }
]

export const savedPayments = [
  {
    id: "PAY-1",
    type: "visa",
    last4: "4242",
    expiry: "12/25",
    cardHolder: "Fahad Mazari",
    isDefault: true
  },
  {
    id: "PAY-2",
    type: "mastercard",
    last4: "5555",
    expiry: "08/26",
    cardHolder: "Fahad Mazari",
    isDefault: false
  }
]
