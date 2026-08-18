import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userNotifications as initialNotifications } from '../data/notifications';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);
const NOTIFICATIONS_KEY = 'vertex_notifications_v1';
const PREFERENCES_KEY = 'vertex_notification_preferences_v1';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth() || {};

  // Load Preferences
  const [preferences, setPreferences] = useState(() => {
    try {
      const data = localStorage.getItem(PREFERENCES_KEY);
      const defaultPrefs = {
        orders: true,
        payments: true,
        promotions: true,
        wishlist: true,
        aiSuggestions: true,
        security: true,
        newsletter: true,
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false
      };
      return data ? JSON.parse(data) : defaultPrefs;
    } catch (e) {
      console.error('Failed to load notification preferences', e);
      return {};
    }
  });

  // Load Notifications List
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return {};
    const session = JSON.parse(sessionStr);
    return { 'Authorization': `Bearer ${session.token}` };
  };

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      // Load initial local notifications
      try {
        const data = localStorage.getItem(NOTIFICATIONS_KEY);
        if (data) {
          setNotifications(JSON.parse(data));
        } else {
          const mapped = initialNotifications.map((notif, index) => ({
            id: notif.id || `NOT-${100 + index}`,
            title: notif.title || 'Notification',
            message: notif.message || notif.text || '',
            category: notif.type === 'promo' ? 'promotions' : notif.type || 'system',
            type: notif.type || 'system',
            priority: notif.type === 'system' || notif.title.includes('Delivered') ? 'high' : 'medium',
            link: notif.link || '/account',
            isRead: notif.read || false,
            isArchived: false,
            createdAt: notif.date || new Date().toISOString(),
            updatedAt: notif.date || new Date().toISOString()
          }));
          setNotifications(mapped);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const headers = getAuthHeader();
      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/notifications', { headers });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.map(n => ({ ...n, id: n._id })));
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Sync Preferences from User Profile
  useEffect(() => {
    if (isAuthenticated && user?.notificationPreferences) {
      setPreferences(prev => ({
        ...prev,
        ...user.notificationPreferences
      }));
    }
  }, [user, isAuthenticated]);

  // Local Storage Sync (Fallback)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }, [notifications, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  // Actions
  const markAsRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => 
      (n.id === id || n._id === id) ? { ...n, isRead: true, updatedAt: new Date().toISOString() } : n
    ));
    if (isAuthenticated) {
      try {
        const headers = getAuthHeader();
        await fetch(`https://vertex-market-backend.vercel.app/api/v1/notifications/${id}/read`, {
          method: 'PUT',
          headers
        });
      } catch (e) {
        console.error('Failed to mark notification as read on backend', e);
      }
    }
  }, [isAuthenticated]);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => 
      !n.isRead ? { ...n, isRead: true, updatedAt: new Date().toISOString() } : n
    ));
    toast.success('All notifications marked as read');
    if (isAuthenticated) {
      // Mark all in background
      try {
        const headers = getAuthHeader();
        await Promise.all(notifications.filter(n => !n.isRead).map(n =>
          fetch(`https://vertex-market-backend.vercel.app/api/v1/notifications/${n.id}/read`, {
            method: 'PUT',
            headers
          })
        ));
      } catch (e) {
        console.error(e);
      }
    }
  }, [notifications, isAuthenticated]);

  const archiveNotification = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => 
      (n.id === id || n._id === id) ? { ...n, isArchived: true, updatedAt: new Date().toISOString() } : n
    ));
    toast.success('Notification archived');
    if (isAuthenticated) {
      try {
        const headers = getAuthHeader();
        await fetch(`https://vertex-market-backend.vercel.app/api/v1/notifications/${id}`, {
          method: 'DELETE',
          headers
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthenticated]);

  const restoreNotification = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      (n.id === id || n._id === id) ? { ...n, isArchived: false, updatedAt: new Date().toISOString() } : n
    ));
    toast.success('Notification restored to inbox');
  }, []);

  const deleteNotification = useCallback(async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
    toast.success('Notification permanently deleted');
    if (isAuthenticated) {
      try {
        const headers = getAuthHeader();
        await fetch(`https://vertex-market-backend.vercel.app/api/v1/notifications/${id}`, {
          method: 'DELETE',
          headers
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthenticated]);

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    toast.success('All notifications cleared');
    if (isAuthenticated) {
      try {
        const headers = getAuthHeader();
        await Promise.all(notifications.map(n =>
          fetch(`https://vertex-market-backend.vercel.app/api/v1/notifications/${n.id}`, {
            method: 'DELETE',
            headers
          })
        ));
      } catch (e) {
        console.error(e);
      }
    }
  }, [notifications, isAuthenticated]);

  const updatePreferences = useCallback(async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    toast.success('Preferences updated successfully');
    
    if (isAuthenticated) {
      try {
        const headers = getAuthHeader();
        await fetch('https://vertex-market-backend.vercel.app/api/v1/auth/notification-preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify(newPrefs)
        });
      } catch (e) {
        console.error('Failed to sync notification preferences', e);
      }
    }
  }, [preferences, isAuthenticated]);

  // Centralized Notification Dispatcher
  const generateNotification = useCallback(async (title, message, category, priority = 'medium', link = '/account') => {
    const mapping = {
      orders: 'orders',
      payments: 'payments',
      promotions: 'promotions',
      wishlist: 'wishlist',
      ai: 'aiSuggestions',
      security: 'security'
    };

    const prefKey = mapping[category];
    if (prefKey && !preferences[prefKey]) {
      return null;
    }

    const tempId = `NOT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newNotif = {
      id: tempId,
      title,
      message,
      category,
      type: category,
      priority,
      link,
      isRead: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (isAuthenticated) {
      try {
        const headers = getAuthHeader();
        const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({
            title,
            message,
            category,
            type: category,
            priority,
            link
          })
        });
        const data = await res.json();
        if (data.success) {
          // Replace temp local notification with the real DB one
          const created = { ...data.data, id: data.data._id };
          setNotifications(prev => prev.map(n => n.id === tempId ? created : n));
        }
      } catch (e) {
        console.error('Failed to save notification to MongoDB', e);
      }
    }

    if (priority === 'high') {
      toast(() => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-900">{title}</span>
          <span className="text-xs text-gray-500 line-clamp-2">{message}</span>
        </div>
      ), {
        icon: '🔔',
        duration: 4000
      });
    }

    return newNotif;
  }, [preferences, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      preferences,
      markAsRead,
      markAllAsRead,
      archiveNotification,
      restoreNotification,
      deleteNotification,
      clearAllNotifications,
      updatePreferences,
      generateNotification,
      addNotification: generateNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
