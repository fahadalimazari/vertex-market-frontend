import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/authService';
import { sessionService } from '../services/auth/sessionService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      let activeSession = sessionService.getSession();
      
      // Fallback to Admin session if public session is missing (cross-portal login support)
      if (!activeSession) {
        const adminSessionStr = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
        if (adminSessionStr) {
          try {
            activeSession = JSON.parse(adminSessionStr);
          } catch (e) {}
        }
      }

      if (activeSession && activeSession.token) {
        try {
          // Fetch freshest user profile to check updated seller statuses
          const freshUser = await authService.getProfile(activeSession.token);
          setSession({ user: freshUser, token: activeSession.token });
          setUser(freshUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch fresh profile. Session may be expired.", error);
          sessionService.clearSession();
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const sessionData = await authService.login(email, password, rememberMe);
      setSession(sessionData);
      setUser(sessionData.user);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${sessionData.user.name}!`);
      return sessionData;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      toast.success(response.message || 'Registration successful!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to request reset');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    try {
      const response = await authService.resetPassword(token, newPassword);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    try {
      const response = await authService.verifyEmail(token);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.message || 'Email verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    setLoading(true);
    try {
      const response = await authService.resendVerificationEmail(email);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to resend verification');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const socialLogin = useCallback(async (provider) => {
    setLoading(true);
    try {
      const sessionData = await authService.socialLogin(provider);
      setSession(sessionData);
      setUser(sessionData.user);
      setIsAuthenticated(true);
      toast.success(`Logged in with ${provider === 'google' ? 'Google' : 'GitHub'}!`);
      return sessionData;
    } catch (error) {
      toast.error(`Authentication via ${provider} failed`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const activeSession = sessionService.getSession();
    if (activeSession && activeSession.token) {
      try {
        const freshUser = await authService.getProfile(activeSession.token);
        const newSession = { ...activeSession, user: freshUser };
        sessionService.setSession(freshUser, activeSession.token, activeSession.rememberMe);
        setSession(newSession);
        setUser(freshUser);
        return freshUser;
      } catch (error) {
        console.error("Failed to refresh session", error);
      }
    }
  }, []);

  const value = {
    user,
    session,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification,
    socialLogin,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
