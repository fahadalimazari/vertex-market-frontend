import { createContext, useState, useEffect, useContext } from 'react';
import { defaultTenantConfig } from './tenantConfig';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(defaultTenantConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock resolution of tenant by domain (e.g., from window.location.hostname)
    const resolveTenant = async () => {
      try {
        const stored = localStorage.getItem('vertex_tenant_config');
        if (stored) {
          setTenant(JSON.parse(stored));
        } else {
          // Fallback to default Vertex Main tenant
          setTenant(defaultTenantConfig);
          localStorage.setItem('vertex_tenant_config', JSON.stringify(defaultTenantConfig));
        }
      } catch (error) {
        console.error('Failed to resolve tenant:', error);
        setTenant(defaultTenantConfig);
      } finally {
        setLoading(false);
      }
    };

    resolveTenant();
  }, []);

  const updateTenant = (newConfig) => {
    const updated = { ...tenant, ...newConfig };
    setTenant(updated);
    localStorage.setItem('vertex_tenant_config', JSON.stringify(updated));
  };

  if (loading) return null; // or a loading spinner

  return (
    <TenantContext.Provider value={{ tenant, updateTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
