import { AUTH_KEYS } from '../../data/auth';

export const sessionService = {
  /**
   * Retrieves the current active session from localStorage.
   * @returns {Object|null}
   */
  getSession: () => {
    try {
      const sessionStr = localStorage.getItem(AUTH_KEYS.SESSION);
      if (!sessionStr) return null;
      
      const session = JSON.parse(sessionStr);
      
      // Check expiration
      if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
        sessionService.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Failed to parse authentication session', error);
      return null;
    }
  },

  /**
   * Sets the active session.
   * @param {Object} user
   * @param {string} token
   * @param {boolean} rememberMe
   */
  setSession: (user, token, rememberMe = false) => {
    try {
      const loginTime = new Date();
      // Session expires in 7 days if rememberMe, otherwise 24 hours
      const expiryHours = rememberMe ? 24 * 7 : 24;
      const expiresAt = new Date(loginTime.getTime() + expiryHours * 60 * 60 * 1000);

      const session = {
        user: {
          ...user,
          id: user.id || user._id,
          role: user.role,
        },
        token,
        expiresAt: expiresAt.toISOString(),
        rememberMe,
        loginTime: loginTime.toISOString(),
      };

      localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
      localStorage.setItem(AUTH_KEYS.AUTH_STATUS, 'true');
      return session;
    } catch (error) {
      console.error('Failed to save session', error);
      return null;
    }
  },

  /**
   * Clears the current active session.
   */
  clearSession: () => {
    try {
      localStorage.removeItem(AUTH_KEYS.SESSION);
      localStorage.setItem(AUTH_KEYS.AUTH_STATUS, 'false');
    } catch (error) {
      console.error('Failed to clear session', error);
    }
  },

  /**
   * Helper to check if current user is logged in.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const session = sessionService.getSession();
    return !!session;
  },

  /**
   * Helper to get user details from current session.
   * @returns {Object|null}
   */
  getUser: () => {
    const session = sessionService.getSession();
    return session ? session.user : null;
  }
};
