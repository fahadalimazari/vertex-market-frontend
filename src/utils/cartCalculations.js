export const calculateCartSubtotal = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return 0
  return cartItems.reduce((total, item) => {
    const price = item.effectivePrice || item.unitPrice || item.price || 0;
    return total + (price * item.quantity);
  }, 0)
}

export const calculateDiscount = (subtotal, coupon) => {
  // Dummy logic: "SAVE10" gives 10% off
  if (coupon && coupon.toUpperCase() === 'SAVE10') {
    return subtotal * 0.10
  }
  return 0
}

export const calculateTax = (amount) => {
  // Dummy logic: 5% flat tax rate
  return amount * 0.05
}

export const calculateShipping = (method) => {
  if (method === 'express') return 500
  if (method === 'standard') return 150
  return 0 // free
}

export const calculateCartTotals = ({ cartItems, coupon, shippingMethod }) => {
  const subtotal = calculateCartSubtotal(cartItems)
  const discount = calculateDiscount(subtotal, coupon)
  
  const subtotalAfterDiscount = subtotal - discount
  const tax = calculateTax(subtotalAfterDiscount)
  const shipping = calculateShipping(shippingMethod)
  
  const grandTotal = subtotalAfterDiscount + tax + shipping

  return {
    subtotal,
    discount,
    tax,
    shipping,
    grandTotal
  }
}
