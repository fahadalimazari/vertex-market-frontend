import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const searchService = {
  querySearch: (query) => {
    // Future API: return apiService.get(`${ENDPOINTS.SEARCH.QUERY}?q=${query}`);
    return Promise.resolve([]);
  }
};

export default searchService;
