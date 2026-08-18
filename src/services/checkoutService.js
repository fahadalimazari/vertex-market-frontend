import { deliveryMethods, paymentMethods, coupons } from '../data/checkout';
import axios from 'axios';

class CheckoutService {
  async getAuthHeaders() {
    const data = localStorage.getItem('vertex_session_v1');
    if (!data) return {};
    const { token } = JSON.parse(data);
    return { Authorization: `Bearer ${token}` };
  }

  // --- Addresses ---
  async getAddresses() {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers.Authorization) return [];
      const res = await axios.get('http://127.0.0.1:5000/api/v1/addresses', { headers });
      // Map _id to id for frontend compatibility
      return res.data.data.map(addr => ({ ...addr, id: addr._id }));
    } catch (e) {
      console.error('Failed to get addresses', e);
      return [];
    }
  }

  async addAddress(address) {
    try {
      const headers = await this.getAuthHeaders();
      await axios.post('http://127.0.0.1:5000/api/v1/addresses', address, { headers });
      return await this.getAddresses();
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to add address');
    }
  }

  async updateAddress(id, updates) {
    try {
      const headers = await this.getAuthHeaders();
      await axios.put(`http://127.0.0.1:5000/api/v1/addresses/${id}`, updates, { headers });
      return await this.getAddresses();
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to update address');
    }
  }

  async deleteAddress(id) {
    try {
      const headers = await this.getAuthHeaders();
      await axios.delete(`http://127.0.0.1:5000/api/v1/addresses/${id}`, { headers });
      return await this.getAddresses();
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to delete address');
    }
  }

  async setDefaultAddress(id) {
    try {
      const headers = await this.getAuthHeaders();
      await axios.patch(`http://127.0.0.1:5000/api/v1/addresses/${id}/default`, {}, { headers });
      return await this.getAddresses();
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to set default address');
    }
  }

  // --- Delivery & Payment ---
  // Using mocks for now as instructed (Phase 8: Payment/Delivery architecture is placeholder)
  async getDeliveryMethods() {
    return deliveryMethods;
  }

  async getPaymentMethods() {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers.Authorization) return paymentMethods;
      
      const res = await axios.get('http://127.0.0.1:5000/api/v1/auth/payments', { headers });
      
      const savedCards = res.data.data.map(pay => ({
        id: pay._id,
        name: `${pay.cardType.toUpperCase()} ending in ${pay.cardNumber ? pay.cardNumber.slice(-4) : ''}`,
        icon: 'FiCreditCard',
        type: 'saved_card'
      }));
      
      return [...savedCards, ...paymentMethods];
    } catch (e) {
      console.error('Failed to fetch saved payment methods', e);
      return paymentMethods;
    }
  }

  // --- Coupons ---
  async validateCoupon(code, cartSubtotal) {
    const upperCode = code.toUpperCase();
    const coupon = coupons[upperCode];
    
    if (!coupon) {
      throw new Error('Invalid coupon code.');
    }
    
    if (cartSubtotal < coupon.minPurchase) {
      throw new Error(`Minimum purchase of Rs. ${coupon.minPurchase} required.`);
    }

    return coupon;
  }

  // --- Order Placement ---
  async placeOrder(orderPayload) {
    try {
      const headers = await this.getAuthHeaders();
      
      // Map frontend cart items to backend order schema
      const formattedItems = orderPayload.items.map(item => ({
        name: item.snapshotName || item.name || item.title,
        quantity: item.quantity,
        image: item.snapshotImage || item.image,
        price: item.effectivePrice || item.unitPrice || item.price,
        product: item.productId || item.id,
        sellerId: item.sellerId
      }));

      const payload = {
        orderItems: formattedItems,
        shippingAddress: {
          address: orderPayload.address.addressLine1 || orderPayload.address.address || '',
          city: orderPayload.address.city || '',
          postalCode: orderPayload.address.postalCode || orderPayload.address.zipCode || '',
          country: orderPayload.address.country || 'Pakistan'
        },
        paymentMethod: orderPayload.paymentId,
        itemsPrice: orderPayload.totals.subtotal,
        taxPrice: orderPayload.totals.tax,
        shippingPrice: orderPayload.totals.deliveryFee,
        totalPrice: orderPayload.totals.total,
      };

      const res = await axios.post('http://127.0.0.1:5000/api/v1/orders', payload, { headers });
      
      return {
        orderId: res.data.data._id,
        status: res.data.data.status,
        ...orderPayload
      };
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to place order');
    }
  }
}

export const checkoutService = new CheckoutService();
