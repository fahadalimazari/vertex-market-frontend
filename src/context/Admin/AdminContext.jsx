import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AdminContext = createContext(null);
const ADMIN_SESSION_KEY = 'vertex_admin_auth_v1';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const data = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load admin session', e);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!adminUser);

  // Auto-logout timeout simulation (e.g. log out after 30 minutes of inactivity)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timeout = setTimeout(() => {
      adminLogout();
      toast.error('Session expired due to inactivity. Please login again.');
    }, 1800000); // 30 minutes

    return () => clearTimeout(timeout);
  }, [isAuthenticated]);

  const adminLogin = useCallback(async (username, password, rememberMe) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (data.success && (data.data.user.role === 'Super Admin' || data.data.user.role === 'Admin')) {
        const user = {
          isAuthenticated: true,
          ...data.data.user,
          token: data.data.token
        };
        
        setAdminUser(user);
        setIsAuthenticated(true);
        
        if (rememberMe) {
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
        } else {
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
        }

        toast.success('Admin logged in successfully!');
        return true;
      } else {
        toast.error(data.message || 'Invalid Email or Password or insufficient permissions');
        return false;
      }
    } catch (error) {
      console.error('Login error', error);
      toast.error('An error occurred during login');
      return false;
    }
  }, []);

  const adminLogout = useCallback(() => {
    setAdminUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    toast.success('Logged out from admin panel');
  }, []);

  const updateAdminSession = useCallback((updates) => {
    setAdminUser((prev) => {
      const newUser = { ...prev, ...updates };
      if (localStorage.getItem(ADMIN_SESSION_KEY)) {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(newUser));
      } else {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(newUser));
      }
      return newUser;
    });
  }, []);


  return (
    <AdminContext.Provider value={{
      adminUser,
      isAuthenticated,
      adminLogin,
      adminLogout,
      updateAdminSession
    }}>
      {children}
    </AdminContext.Provider>
  );
};
