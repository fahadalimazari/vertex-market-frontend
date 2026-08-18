import apiService from './api/apiService';
import ENDPOINTS from './api/endpoints';

export const authService = {
  login: (email, password) => {
    // Future API call: return apiService.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    return Promise.resolve({
      isAuthenticated: true,
      token: 'dummy-jwt-access-token',
      user: { id: 'usr-1', email, name: 'Fahad Mazari', role: 'Customer' }
    });
  },

  register: (name, email, password) => {
    // Future API call: return apiService.post(ENDPOINTS.AUTH.REGISTER, { name, email, password });
    return Promise.resolve({
      isAuthenticated: true,
      token: 'dummy-jwt-access-token',
      user: { id: 'usr-2', email, name, role: 'Customer' }
    });
  },

  logout: () => {
    // Future API call: return apiService.post(ENDPOINTS.AUTH.LOGOUT);
    return Promise.resolve(true);
  }
};

export default authService;
