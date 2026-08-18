import { sessionService } from './sessionService';

const API_URL = 'https://vertex-market-backend.vercel.app/api/v1/auth';

export const authService = {
  login: async (email, password, rememberMe = false) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Invalid credentials');
    }
    
    // sessionService expects (user, token, rememberMe)
    return sessionService.setSession(data.data.user, data.data.token, rememberMe);
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  getProfile: async (overrideToken = null) => {
    const session = sessionService.getSession();
    const token = overrideToken || (session ? session.token : null);
    if (!token) throw new Error('No token found');
    
    const res = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    
    // Update local session storage with freshest user data
    sessionService.setSession(data.data, session.token, true);
    return data.data;
  },

  updateProfile: async (profileData) => {
    const session = sessionService.getSession();
    const token = session ? session.token : null;
    if (!token) throw new Error('No token found');
    
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    return data.data;
  },

  logout: async () => {
    sessionService.clearSession();
    return true;
  },

  // Security & MFA
  changePassword: async (currentPassword, newPassword) => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to change password');
    return data;
  },

  setupMfa: async () => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/mfa/setup`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to setup MFA');
    return data;
  },

  verifyMfa: async (token) => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/mfa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to verify MFA');
    return data;
  },

  disableMfa: async (currentPassword, token) => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/mfa/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify({ currentPassword, token })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to disable MFA');
    return data;
  },

  // Sessions
  getSessions: async () => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch sessions');
    return data.data;
  },

  revokeSession: async (sessionId) => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to revoke session');
    return data;
  },

  revokeAllOtherSessions: async () => {
    const session = sessionService.getSession();
    if (!session) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to revoke other sessions');
    return data;
  },

  // Mock functions for unused/future endpoints
  forgotPassword: async (email) => {
    return { success: true, message: 'Password reset link sent.' };
  },
  resetPassword: async (token, newPassword) => {
    return { success: true, message: 'Password reset successful.' };
  },
  verifyEmail: async (token) => {
    return { success: true, message: 'Email verified.' };
  },
  resendVerificationEmail: async (email) => {
    return { success: true, message: 'Verification email sent.' };
  },
  socialLogin: async (provider) => {
    throw new Error('Social login not implemented yet');
  }
};
