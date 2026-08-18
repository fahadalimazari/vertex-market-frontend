import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const sellerService = {
  registerSeller: (data) => {
    // Future API call: return apiService.post(ENDPOINTS.SELLER.REGISTER, data);
    return Promise.resolve({ id: `SEL-${Date.now()}`, ...data, status: 'Pending Approval' });
  },

  getSellerProducts: () => {
    // Future API call: return apiService.get(ENDPOINTS.SELLER.PRODUCTS);
    return Promise.resolve([]);
  }
};

export default sellerService;
