import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const AIContext = createContext()

export const useAI = () => useContext(AIContext)

export const AIProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth() || {}
  
  // Panel state
  const [isOpen, setIsOpen] = useState(false)
  
  // Chat state
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [loadingStep, setLoadingStep] = useState(null) // 'Thinking...', 'Searching Products...', etc.
  
  // History state
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ai_chat_v1')
    return saved ? JSON.parse(saved) : []
  })
  
  // Context state
  const [currentProductContext, setCurrentProductContext] = useState(null)

  // Sync database chat history to state when logged in
  useEffect(() => {
    if (isAuthenticated && user?.chatHistory) {
      setHistory(user.chatHistory)
    }
  }, [user, isAuthenticated]);
  
  // Sync to backend helper
  const syncChatToBackend = useCallback(async (newHistory) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      await fetch('https://vertex-market-backend.vercel.app/api/v1/auth/chat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ history: newHistory })
      });
    } catch (e) {
      console.error('Failed to sync chat history to backend', e);
    }
  }, []);

  // Persist history to local storage & backend
  useEffect(() => {
    localStorage.setItem('ai_chat_v1', JSON.stringify(history))
    if (isAuthenticated) {
      syncChatToBackend(history);
    }
  }, [history, isAuthenticated, syncChatToBackend])

  // Core Send Message Workflow
  const sendMessage = async (text) => {
    if (!text.trim()) return

    // 1. Add User Message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    // Fake loading sequence
    setLoadingStep('Thinking...')
    await new Promise(r => setTimeout(r, 600))
    
    // 2. Fetch Real AI Response
    try {
      const aiServiceModule = await import('../services/aiService');
      const res = await aiServiceModule.aiService.getAIChatResponse(text, { 
        productContext: currentProductContext 
      });
      
      const responseData = res.data || res;
      
      let aiText = responseData.text || "I processed your request.";
      let type = "text";
      let products = [];
      let comparisonData = null;
      let orderData = null;
      let storeData = null;
      let actionLink = null;
      
      if (responseData.action) {
        const actionType = responseData.action.type;
        const actionData = responseData.action.data;
        
        if (actionType === 'SHOW_PRODUCTS') {
          type = 'recommendation';
          products = actionData;
        } else if (actionType === 'COMPARE_PRODUCTS') {
          type = 'comparison';
          comparisonData = actionData;
        } else if (actionType === 'SHOW_ORDER') {
          type = 'order';
          orderData = actionData;
        } else if (actionType === 'SHOW_STORES') {
          type = 'stores';
          storeData = actionData;
        } else if (actionType === 'SUPPORT_LINK') {
          type = 'support_link';
          actionLink = actionData;
        }
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        type: type,
        products: products,
        comparisonData: comparisonData,
        orderData: orderData,
        storeData: storeData,
        actionLink: actionLink,
        suggestions: [],
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again later.",
        type: 'text',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    }
    
    setIsTyping(false)
    setLoadingStep(null)
  }

  // History Actions
  const clearChat = () => {
    if (messages.length > 0) {
      // Save current chat to history before clearing if it has messages
      const session = {
        id: Date.now(),
        preview: messages[0].text.substring(0, 40) + '...',
        messages: messages,
        date: new Date().toISOString()
      }
      setHistory(prev => [session, ...prev])
    }
    setMessages([])
  }

  const clearHistory = () => {
    setHistory([])
    setMessages([])
    localStorage.removeItem('ai_chat_v1')
  }
  
  const loadChatFromHistory = (sessionId) => {
    const session = history.find(s => s.id === sessionId)
    if (session) {
      setMessages(session.messages)
    }
  }

  const deleteChatFromHistory = (sessionId) => {
    setHistory(prev => prev.filter(s => s.id !== sessionId))
  }

  // Expose state and methods
  const value = {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    loadingStep,
    sendMessage,
    clearChat,
    history,
    clearHistory,
    loadChatFromHistory,
    deleteChatFromHistory,
    currentProductContext,
    setCurrentProductContext
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}
