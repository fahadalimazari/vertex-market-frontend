import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const categoryService = {
  getCategories: async (params) => {
    return apiService.get(ENDPOINTS.CATEGORY.LIST, { params });
  },

  getActiveCategories: async () => {
    return apiService.get(ENDPOINTS.CATEGORY.ACTIVE);
  },

  getCategoryById: async (id) => {
    return apiService.get(`${ENDPOINTS.CATEGORY.LIST}/${id}`);
  },

  createCategory: async (categoryData) => {
    return apiService.post(ENDPOINTS.CATEGORY.LIST, categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return apiService.put(`${ENDPOINTS.CATEGORY.LIST}/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return apiService.delete(`${ENDPOINTS.CATEGORY.LIST}/${id}`);
  }
};

export default categoryService;
