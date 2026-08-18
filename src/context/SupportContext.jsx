import { createContext, useState, useEffect, useCallback } from 'react';
import { fetchTickets, fetchFaq } from '../services/supportService';
import { useNotifications } from './NotificationContext';
import toast from 'react-hot-toast';

export const SupportContext = createContext(null);

export const SupportProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  
  const [tickets, setTickets] = useState([]);
  const [faqCategories, setFaqCategories] = useState([]);
  const [faqArticles, setFaqArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [tData, fData] = await Promise.all([
          fetchTickets(), fetchFaq()
        ]);
        const mappedTickets = tData.map(t => ({ ...t, id: t._id }));
        setTickets(mappedTickets);
        setFaqCategories(fData.categories);
        setFaqArticles(fData.articles);
      } catch (error) {
        console.error("Error loading support data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const createTicket = useCallback(async (subject, category, initialMessage) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch('http://localhost:5000/api/v1/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ subject, category, message: initialMessage })
      });
      const data = await res.json();
      if (data.success) {
        const created = { ...data.data, id: data.data._id };
        setTickets(prev => [created, ...prev]);
        toast.success("Support ticket created successfully.");
        addNotification("Ticket Created", `Your support ticket #${created.id} has been opened.`, "support");
        return created;
      }
    } catch (error) {
      console.error('Failed to create ticket', error);
      toast.error('Failed to create support ticket');
    }
    return null;
  }, [addNotification]);

  const replyToTicket = useCallback(async (ticketId, text) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      const res = await fetch(`http://localhost:5000/api/v1/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...data.data, id: data.data._id };
        setTickets(prev => prev.map(t => (t.id === ticketId || t._id === ticketId) ? updated : t));
        toast.success("Message sent.");
      }
    } catch (error) {
      console.error('Failed to reply to ticket', error);
      toast.error('Failed to send message');
    }
  }, []);

  const closeTicket = useCallback((ticketId) => {
    setTickets(prev => prev.map(t => (t.id === ticketId || t._id === ticketId) ? { ...t, status: 'Closed', updatedAt: new Date().toISOString() } : t));
    toast.success("Ticket closed.");
  }, []);

  const value = {
    tickets,
    faqCategories,
    faqArticles,
    isLoading,
    createTicket,
    replyToTicket,
    closeTicket
  };

  return (
    <SupportContext.Provider value={value}>
      {children}
    </SupportContext.Provider>
  );
};
