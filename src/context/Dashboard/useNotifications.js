import { useState, useEffect } from 'react'
import { userNotifications as initialNotifications } from '../../data/notifications'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('vertex_notifications_v1')
    return saved ? JSON.parse(saved) : initialNotifications
  })

  useEffect(() => {
    localStorage.setItem('vertex_notifications_v1', JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  }
}
