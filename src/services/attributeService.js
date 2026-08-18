import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const attributeService = {
  getAttributes: async (params) => {
    return apiService.get(ENDPOINTS.ATTRIBUTE.LIST, { params });
  },

  getActiveAttributes: async () => {
    return apiService.get(ENDPOINTS.ATTRIBUTE.ACTIVE);
  },

  getAttributeById: async (id) => {
    return apiService.get(`${ENDPOINTS.ATTRIBUTE.LIST}/${id}`);
  },

  getAttributesBySubCategory: async (subCategoryId) => {
    return apiService.get(ENDPOINTS.ATTRIBUTE.BY_SUBCATEGORY(subCategoryId));
  },

  createAttribute: async (attributeData) => {
    return apiService.post(ENDPOINTS.ATTRIBUTE.LIST, attributeData);
  },

  updateAttribute: async (id, attributeData) => {
    return apiService.put(`${ENDPOINTS.ATTRIBUTE.LIST}/${id}`, attributeData);
  },

  deleteAttribute: async (id) => {
    return apiService.delete(`${ENDPOINTS.ATTRIBUTE.LIST}/${id}`);
  }
};

export default attributeService;
