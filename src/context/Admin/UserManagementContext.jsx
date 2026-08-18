import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const UserManagementContext = createContext(null);
const USERS_KEY = 'vertex_admin_users_v1';

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};

export const UserManagementProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      const defaultUsers = [
        { id: 'USR-001', name: 'Fahad Mazari', email: 'fahad@vertex.market', phone: '03001234567', role: 'Customer', status: 'Active', joinDate: '2026-01-15' },
        { id: 'USR-002', name: 'Ali Ahmed', email: 'ali@gmail.com', phone: '03001122334', role: 'Seller', status: 'Active', joinDate: '2026-02-10' },
        { id: 'USR-003', name: 'Saira Bano', email: 'saira@outlook.com', phone: '03129876543', role: 'Customer', status: 'Suspended', joinDate: '2026-03-01' }
      ];
      return data ? JSON.parse(data) : defaultUsers;
    } catch (e) {
      console.error('Failed to load users', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const suspendUser = useCallback((id) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: 'Suspended' } : u
    ));
    toast.success('User account suspended');
  }, []);

  const activateUser = useCallback((id) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: 'Active' } : u
    ));
    toast.success('User account activated');
  }, []);

  const deleteUser = useCallback((id) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user) {
      toast.success(`User ${user.name} permanently deleted`);
    }
  }, [users]);

  const editUser = useCallback((id, updatedData) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...updatedData } : u
    ));
    toast.success('User details updated');
  }, []);

  const resetUserPassword = useCallback((id) => {
    toast.success('Password reset link dispatched to user email');
  }, []);

  return (
    <UserManagementContext.Provider value={{
      users,
      suspendUser,
      activateUser,
      deleteUser,
      editUser,
      resetUserPassword
    }}>
      {children}
    </UserManagementContext.Provider>
  );
};
