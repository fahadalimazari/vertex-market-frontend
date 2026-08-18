import { useState, useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';

const NetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
          <FiWifiOff />
        </div>
        You are currently offline. Some features may be limited.
      </div>
    </div>
  );
};

export default NetworkStatus;
