import { useState, useEffect, useCallback } from 'react'
import axiosClient from '../../services/api/axiosClient'

export const usePayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const mapToFrontend = (pay) => ({
    id: pay._id,
    _id: pay._id,
    cardHolder: pay.cardholderName,
    cardNumber: pay.cardNumber,
    expiry: pay.expiryDate,
    type: pay.cardType || 'visa',
    last4: pay.cardNumber ? pay.cardNumber.slice(-4) : '',
    isDefault: pay.isDefault
  });

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/auth/payments')
      if (res.data.success) {
        setPayments(res.data.data.map(mapToFrontend))
      }
    } catch (e) {
      console.error('Failed to fetch payments', e)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const addPayment = async (newPayment) => {
    try {
      const payload = {
        cardholderName: newPayment.nameOnCard,
        cardNumber: newPayment.cardNumber,
        expiryDate: newPayment.expiryDate,
        cardType: newPayment.type || 'visa',
        isDefault: newPayment.isDefault
      };
      
      const res = await axiosClient.post('/auth/payments', payload);
      if (res.data.success) {
        fetchPayments()
      }
    } catch (e) {
      console.error('Failed to add payment method', e)
      throw e;
    }
  }

  const removePayment = async (id) => {
    try {
      const res = await axiosClient.delete(`/auth/payments/${id}`);
      if (res.data.success) {
        fetchPayments()
      }
    } catch (e) {
      console.error('Failed to delete payment method', e)
      throw e;
    }
  }

  const setDefaultPayment = async (id) => {
    try {
      const res = await axiosClient.patch(`/auth/payments/${id}/default`);
      if (res.data.success) {
        fetchPayments()
      }
    } catch (e) {
      console.error('Failed to set default payment', e)
      throw e;
    }
  }

  return { payments, addPayment, removePayment, setDefaultPayment, loading }
}
