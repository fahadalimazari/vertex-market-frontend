import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const MarketplaceSettingsContext = createContext(null);
const SETTINGS_KEY = 'vertex_admin_settings_v1';

export const useMarketplaceSettings = () => {
  const context = useContext(MarketplaceSettingsContext);
  if (!context) {
    throw new Error('useMarketplaceSettings must be used within a MarketplaceSettingsProvider');
  }
  return context;
};

export const MarketplaceSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      const defaultSettings = {
        storeName: 'Vertex Market',
        currency: 'PKR',
        taxRate: 15,
        defaultShippingFee: 250,
        enableAI: true,
        enableNotifications: true,
        metaTitle: 'Vertex Market - Best Multi-Vendor Portal',
        metaDescription: 'Shop millions of products online.'
      };
      return data ? JSON.parse(data) : defaultSettings;
    } catch (e) {
      console.error('Failed to load settings', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Marketplace settings updated');
  }, []);

  return (
    <MarketplaceSettingsContext.Provider value={{
      settings,
      updateSettings
    }}>
      {children}
    </MarketplaceSettingsContext.Provider>
  );
};
