import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated }), [isAuthenticated])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
