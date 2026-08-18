import apiService from './api/apiService';

export const cartService = {
  getCart: () => {
    return Promise.resolve([]);
  },
  updateCart: (items) => {
    return Promise.resolve(items);
  }
};

export default cartService;
