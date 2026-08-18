import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const adminService = {
  loginAdmin: (email, password) => {
    return Promise.resolve({
      isAuthenticated: true,
      role: 'Super Admin',
      name: 'Vertex Super Admin',
      email
    });
  },

  getDashboard: () => {
    return Promise.resolve({
      totalUsers: 3,
      totalSellers: 3,
      totalProducts: 4
    });
  },

  manageUsers: () => {
    return Promise.resolve([]);
  },

  manageProducts: () => {
    return Promise.resolve([]);
  }
};

export default adminService;
