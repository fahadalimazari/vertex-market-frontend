import axios from 'axios';
import { sessionService } from '../auth/sessionService';

const API_URL = 'https://vertex-market-backend.vercel.app/api/v1/seller';

const getHeaders = () => {
  const session = sessionService.getSession();
  return {
    headers: {
      Authorization: `Bearer ${session?.token}`,
    },
  };
};

export const sellerService = {
  // Dashboard & Analytics
  getDashboardStats: async () => {
    const res = await axios.get(`${API_URL}/dashboard`, getHeaders());
    return res.data;
  },
  getAnalytics: async () => {
    const res = await axios.get(`${API_URL}/analytics`, getHeaders());
    return res.data;
  },

  // Products & Inventory
  getProducts: async () => {
    const res = await axios.get(`${API_URL}/products`, getHeaders());
    return res.data;
  },
  getInventory: async () => {
    const res = await axios.get(`${API_URL}/inventory`, getHeaders());
    return res.data;
  },
  updateInventory: async (id, data) => {
    const res = await axios.put(`${API_URL}/inventory/${id}`, data, getHeaders());
    return res.data;
  },

  // Orders & Returns
  getOrders: async () => {
    const res = await axios.get(`${API_URL}/orders`, getHeaders());
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await axios.put(`${API_URL}/orders/${id}/status`, { status }, getHeaders());
    return res.data;
  },
  getReturns: async () => {
    const res = await axios.get(`${API_URL}/returns`, getHeaders());
    return res.data;
  },
  updateReturnStatus: async (id, status) => {
    const res = await axios.put(`${API_URL}/returns/${id}/status`, { status }, getHeaders());
    return res.data;
  },

  // Finance
  getFinance: async () => {
    const res = await axios.get(`${API_URL}/finance`, getHeaders());
    return res.data;
  },
  requestWithdrawal: async (data) => {
    const res = await axios.post(`${API_URL}/finance/withdraw`, data, getHeaders());
    return res.data;
  },

  // Staff
  getStaff: async () => {
    const res = await axios.get(`${API_URL}/staff`, getHeaders());
    return res.data;
  },
  addStaff: async (data) => {
    const res = await axios.post(`${API_URL}/staff`, data, getHeaders());
    return res.data;
  },

  // Coupons
  getCoupons: async () => {
    const res = await axios.get(`${API_URL}/coupons`, getHeaders());
    return res.data;
  },
  createCoupon: async (data) => {
    const res = await axios.post(`${API_URL}/coupons`, data, getHeaders());
    return res.data;
  },

  // Store Settings (Theme, Policies, SEO, Profile)
  getProfile: async () => {
    const res = await axios.get(`${API_URL}/profile`, getHeaders());
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await axios.put(`${API_URL}/settings`, data, getHeaders());
    return res.data;
  },
  updateTheme: async (data) => {
    const res = await axios.put(`${API_URL}/theme`, data, getHeaders());
    return res.data;
  },
  updatePolicies: async (data) => {
    const res = await axios.put(`${API_URL}/policies`, data, getHeaders());
    return res.data;
  },
  updateSeo: async (data) => {
    const res = await axios.put(`${API_URL}/seo`, data, getHeaders());
    return res.data;
  },

  // Communication
  getMessages: async () => {
    const res = await axios.get(`${API_URL}/messages`, getHeaders());
    return res.data;
  },
  getSupportTickets: async () => {
    const res = await axios.get(`${API_URL}/support`, getHeaders());
    return res.data;
  },
  createTicket: async (data) => {
    const res = await axios.post(`${API_URL}/support`, data, getHeaders());
    return res.data;
  }
};
