import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RoleContext = createContext(null);
const ROLES_KEY = 'vertex_admin_roles_v1';

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

const defaultPermissions = {
  'Super Admin': ['users', 'sellers', 'products', 'orders', 'coupons', 'reviews', 'cms', 'analytics', 'settings', 'logs'],
  'Admin': ['products', 'orders', 'users', 'sellers', 'analytics'],
  'Moderator': ['reviews', 'products'],
  'Support Agent': ['orders', 'users'],
  'Content Manager': ['cms', 'coupons']
};

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const data = localStorage.getItem(ROLES_KEY);
      return data ? JSON.parse(data) : 'Super Admin'; // Default to Super Admin for testing
    } catch (e) {
      return 'Super Admin';
    }
  });

  useEffect(() => {
    localStorage.setItem(ROLES_KEY, JSON.stringify(currentRole));
  }, [currentRole]);

  const hasPermission = useCallback((module) => {
    const perms = defaultPermissions[currentRole] || [];
    return currentRole === 'Super Admin' || perms.includes(module);
  }, [currentRole]);

  const changeRole = useCallback((role) => {
    if (defaultPermissions[role]) {
      setCurrentRole(role);
    }
  }, []);

  return (
    <RoleContext.Provider value={{
      currentRole,
      hasPermission,
      changeRole,
      availableRoles: Object.keys(defaultPermissions)
    }}>
      {children}
    </RoleContext.Provider>
  );
};
