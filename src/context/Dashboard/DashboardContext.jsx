import { createContext, useContext } from 'react'
import { useUser } from './useUser'
import { useOrders } from '../../hooks/useOrders'
import { useWishlist } from '../WishlistContext'
import { useAddresses } from './useAddresses'
import { usePayments } from './usePayments'
import { useNotifications } from './useNotifications'

export const DashboardContext = createContext(null)

export const DashboardProvider = ({ children }) => {
  const user = useUser()
  const orders = useOrders()
  const wishlist = useWishlist()
  const addresses = useAddresses()
  const payments = usePayments()
  const notifications = useNotifications()

  const value = {
    ...user,
    ...orders,
    ...wishlist,
    ...addresses,
    ...payments,
    ...notifications
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
