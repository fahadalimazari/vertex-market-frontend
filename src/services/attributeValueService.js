import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const attributeValueService = {
  getAttributeValues: async (params) => {
    return apiService.get(ENDPOINTS.ATTRIBUTE_VALUE.LIST, { params });
  },

  getActiveAttributeValues: async (attributeId) => {
    const params = attributeId ? { attributeId } : {};
    return apiService.get(ENDPOINTS.ATTRIBUTE_VALUE.ACTIVE, { params });
  },

  getAttributeValuesByAttribute: async (attributeId) => {
    return apiService.get(ENDPOINTS.ATTRIBUTE_VALUE.BY_ATTRIBUTE(attributeId));
  },

  createAttributeValue: async (payload) => {
    return apiService.post(ENDPOINTS.ATTRIBUTE_VALUE.LIST, payload);
  },

  updateAttributeValue: async (id, payload) => {
    return apiService.put(`${ENDPOINTS.ATTRIBUTE_VALUE.LIST}/${id}`, payload);
  },

  deleteAttributeValue: async (id) => {
    return apiService.delete(`${ENDPOINTS.ATTRIBUTE_VALUE.LIST}/${id}`);
  }
};

export default attributeValueService;
