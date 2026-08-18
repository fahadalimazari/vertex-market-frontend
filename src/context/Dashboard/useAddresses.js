import { useState, useEffect, useCallback } from 'react'

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)

  const getAuthHeader = () => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return {};
    const session = JSON.parse(sessionStr);
    return { 'Authorization': `Bearer ${session.token}` };
  };

  const mapToFrontend = (addr) => ({
    id: addr._id,
    _id: addr._id,
    name: addr.fullName,
    phone: addr.phone,
    street: addr.addressLine1,
    city: addr.city,
    state: addr.province,
    zipCode: addr.postalCode,
    country: addr.country || 'Pakistan',
    title: addr.addressType || 'Home',
    isDefault: addr.isDefault
  });

  const mapToBackend = (addr) => ({
    fullName: addr.name,
    phone: addr.phone,
    addressLine1: addr.street,
    city: addr.city,
    province: addr.state,
    postalCode: addr.zipCode,
    country: addr.country || 'Pakistan',
    addressType: addr.title || 'Home',
    isDefault: addr.isDefault
  });

  const fetchAddresses = useCallback(async () => {
    setLoading(true)
    try {
      const headers = getAuthHeader();
      if (!headers.Authorization) {
        setAddresses([]);
        setLoading(false);
        return;
      }
      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/addresses', { headers })
      const data = await res.json()
      if (data.success) {
        setAddresses(data.data.map(mapToFrontend))
      }
    } catch (e) {
      console.error('Failed to fetch addresses', e)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const addAddress = async (newAddress) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(mapToBackend(newAddress))
      })
      const data = await res.json()
      if (data.success) {
        fetchAddresses()
      }
    } catch (e) {
      console.error('Failed to add address', e)
    }
  }

  const updateAddress = async (id, updatedData) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(`https://vertex-market-backend.vercel.app/api/v1/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(mapToBackend(updatedData))
      })
      const data = await res.json()
      if (data.success) {
        fetchAddresses()
      }
    } catch (e) {
      console.error('Failed to update address', e)
    }
  }

  const removeAddress = async (id) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(`https://vertex-market-backend.vercel.app/api/v1/addresses/${id}`, {
        method: 'DELETE',
        headers
      })
      const data = await res.json()
      if (data.success) {
        fetchAddresses()
      }
    } catch (e) {
      console.error('Failed to delete address', e)
    }
  }

  const setDefaultAddress = async (id) => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(`https://vertex-market-backend.vercel.app/api/v1/addresses/${id}/default`, {
        method: 'PATCH',
        headers
      })
      const data = await res.json()
      if (data.success) {
        fetchAddresses()
      }
    } catch (e) {
      console.error('Failed to set default address', e)
    }
  }

  return { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress, loading }
}
