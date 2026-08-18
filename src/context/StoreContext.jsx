import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const StoreContext = createContext(null);
const STORE_KEY = 'vertex_store_v1';

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const data = localStorage.getItem(STORE_KEY);
      const defaultStore = {
        name: 'Vertex Electro Store',
        description: 'Your premier source for gaming gears, high-end electronics, and smart devices.',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
        banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        email: 'seller@vertex.market',
        phone: '+92 300 1234567',
        address: 'Suite 404, Tech Plaza, Karachi, Pakistan',
        facebook: 'https://facebook.com/vertexstore',
        twitter: 'https://twitter.com/vertexstore',
        hours: '09:00 AM - 09:00 PM',
        updatedAt: new Date().toISOString()
      };
      return data ? JSON.parse(data) : defaultStore;
    } catch (e) {
      console.error('Failed to load store settings', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(storeSettings));
  }, [storeSettings]);

  const updateStoreSettings = useCallback((settings) => {
    setStoreSettings(prev => ({
      ...prev,
      ...settings,
      updatedAt: new Date().toISOString()
    }));
    toast.success('Store settings updated successfully');
  }, []);

  return (
    <StoreContext.Provider value={{
      storeSettings,
      updateStoreSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};
