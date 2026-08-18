import toast from 'react-hot-toast';
import { api } from './api';

export const newsletterService = {
  subscribe: async (email, source = 'Homepage') => {
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      throw new Error('Invalid email format');
    }

    try {
      const res = await api.post('/newsletter/subscribe', { email, source });
      
      if (res.data.success) {
        toast.success(res.data.message || 'Successfully subscribed to Vertex newsletter!');
        return res.data.data;
      } else {
        toast.error(res.data.message || 'Failed to subscribe.');
        throw new Error(res.data.message);
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMsg);
      throw e;
    }
  }
};

export default newsletterService;
