import { api } from './api';

export const brandService = {
  getBrands: async () => {
    const res = await api.get('/brands');
    return res.data.data;
  },

  getBrandBySlug: async (slug) => {
    const res = await api.get(`/brands/${slug}`);
    return res.data.data;
  },

  getFeaturedBrands: async () => {
    const res = await api.get('/brands?featured=true');
    return res.data.data;
  },
  
  followBrand: async (id) => {
    const res = await api.post(`/brands/${id}/follow`);
    return res.data;
  },
  
  unfollowBrand: async (id) => {
    const res = await api.post(`/brands/${id}/unfollow`);
    return res.data;
  }
};

export default brandService;
