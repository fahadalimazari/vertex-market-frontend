import { api } from './api';

export const storeService = {
  getPublicStores: async (limit = 20) => {
    const res = await api.get(`/seller/stores?limit=${limit}`);
    return res.data.data;
  },

  getStoreBySlug: async (slug) => {
    const res = await api.get(`/seller/store/${slug}`);
    return res.data.data;
  },

  getStoreProducts: async (slug, params = {}) => {
    const res = await api.get(`/seller/store/${slug}/products`, { params });
    return res.data;
  }
};

export default storeService;
