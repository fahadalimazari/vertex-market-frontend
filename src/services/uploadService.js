import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const uploadService = {
  uploadProductImage: (file) => {
    // Future API call: return apiService.post(ENDPOINTS.UPLOAD.FILE, file);
    return Promise.resolve({ url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300' });
  },

  uploadUserAvatar: (file) => {
    return Promise.resolve({ url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150' });
  },

  uploadSellerDocuments: (file) => {
    return Promise.resolve({ url: 'https://example.com/uploaded-document.pdf' });
  },

  uploadStoreBanner: (file) => {
    return Promise.resolve({ url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600' });
  }
};

export default uploadService;
