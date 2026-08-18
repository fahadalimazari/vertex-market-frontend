import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LogsContext = createContext(null);
const LOGS_KEY = 'vertex_admin_logs_v1';

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};

export const LogsProvider = ({ children }) => {
  const [logs, setLogs] = useState(() => {
    try {
      const data = localStorage.getItem(LOGS_KEY);
      const defaultLogs = [
        { id: 'LOG-1002', adminName: 'Super Admin', action: 'Seller Approved', details: 'Approved store application for "Vertex Electro Store"', createdAt: '2026-07-10T14:30:00Z' },
        { id: 'LOG-1001', adminName: 'Super Admin', action: 'Settings Changed', details: 'Updated marketplace tax rate to 15%', createdAt: '2026-07-09T09:15:00Z' }
      ];
      return data ? JSON.parse(data) : defaultLogs;
    } catch (e) {
      console.error('Failed to load logs', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((action, details, adminName = 'Super Admin') => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      adminName,
      action,
      details,
      createdAt: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  return (
    <LogsContext.Provider value={{
      logs,
      addLog
    }}>
      {children}
    </LogsContext.Provider>
  );
};
