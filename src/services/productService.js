import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';
import { products } from '../data/products';

export const productService = {
  getProducts: async (params) => {
    return apiService.get(ENDPOINTS.PRODUCT.LIST, { params });
  },

  getProductBySlug: async (slug) => {
    return apiService.get(ENDPOINTS.PRODUCT.BY_SLUG(slug));
  },

  getProductById: async (id) => {
    return apiService.get(ENDPOINTS.PRODUCT.DETAIL(id));
  },

  createProduct: async (productData) => {
    return apiService.post(ENDPOINTS.PRODUCT.LIST, productData);
  },

  updateProduct: async (id, productData) => {
    return apiService.put(ENDPOINTS.PRODUCT.DETAIL(id), productData);
  },

  deleteProduct: async (id) => {
    return apiService.delete(ENDPOINTS.PRODUCT.DETAIL(id));
  },

  getFeaturedProducts: async () => {
    return apiService.get(ENDPOINTS.PRODUCT.FEATURED);
  },

  getRelatedProducts: async (id) => {
    return apiService.get(ENDPOINTS.PRODUCT.RELATED(id));
  }
};

export default productService;
