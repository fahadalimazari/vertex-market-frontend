import { api } from './api';

export const bundleService = {
  getBundles: async () => {
    const res = await api.get('/bundles');
    return res.data.data;
  },

  getBundleBySlug: async (slug) => {
    const res = await api.get(`/bundles/${slug}`);
    return res.data.data;
  },

  addBundleToCart: async (bundleId) => {
    const res = await api.post('/cart/bundle', { bundleId });
    return res.data;
  }
};

export default bundleService;
