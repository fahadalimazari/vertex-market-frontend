import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const subCategoryService = {
  getSubCategories: async (params) => {
    return apiService.get(ENDPOINTS.SUBCATEGORY.LIST, { params });
  },

  getActiveSubCategories: async () => {
    return apiService.get(ENDPOINTS.SUBCATEGORY.ACTIVE);
  },

  getSubCategoryById: async (id) => {
    return apiService.get(`${ENDPOINTS.SUBCATEGORY.LIST}/${id}`);
  },

  getSubCategoriesByCategory: async (categoryId) => {
    return apiService.get(ENDPOINTS.SUBCATEGORY.BY_CATEGORY(categoryId));
  },

  createSubCategory: async (subCategoryData) => {
    return apiService.post(ENDPOINTS.SUBCATEGORY.LIST, subCategoryData);
  },

  updateSubCategory: async (id, subCategoryData) => {
    return apiService.put(`${ENDPOINTS.SUBCATEGORY.LIST}/${id}`, subCategoryData);
  },

  deleteSubCategory: async (id) => {
    return apiService.delete(`${ENDPOINTS.SUBCATEGORY.LIST}/${id}`);
  }
};

export default subCategoryService;
