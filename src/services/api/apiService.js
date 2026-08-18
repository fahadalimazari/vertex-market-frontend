import axiosClient from './axiosClient';

export const apiService = {
  get: (url, config = {}) => {
    return axiosClient.get(url, config);
  },
  post: (url, data = {}, config = {}) => {
    return axiosClient.post(url, data, config);
  },
  put: (url, data = {}, config = {}) => {
    return axiosClient.put(url, data, config);
  },
  patch: (url, data = {}, config = {}) => {
    return axiosClient.patch(url, data, config);
  },
  delete: (url, config = {}) => {
    return axiosClient.delete(url, config);
  }
};

export default apiService;
