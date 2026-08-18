import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CMSContext = createContext(null);
const CMS_KEY = 'vertex_admin_cms_v1';

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export const CMSProvider = ({ children }) => {
  const [sections, setSections] = useState(() => {
    try {
      const data = localStorage.getItem(CMS_KEY);
      const defaultSections = {
        hero: true,
        categories: true,
        flashSale: true,
        featuredProducts: true,
        newsletter: true,
        footer: true,
        about: true,
        contact: true
      };
      return data ? JSON.parse(data) : defaultSections;
    } catch (e) {
      console.error('Failed to load CMS sections', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(CMS_KEY, JSON.stringify(sections));
  }, [sections]);

  const toggleSection = useCallback((key) => {
    setSections(prev => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(`${key.replace(/([A-Z])/g, ' $1')} visibility updated`);
      return next;
    });
  }, []);

  return (
    <CMSContext.Provider value={{
      sections,
      toggleSection
    }}>
      {children}
    </CMSContext.Provider>
  );
};
