import { sessionService } from '../auth/sessionService';

const API_URL = 'https://vertex-market-backend.vercel.app/api/v1/coupons';

export const couponService = {
  getMyVouchers: async () => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    
    const res = await fetch(`${API_URL}/my-vouchers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch vouchers');
    return data.data;
  }
};
