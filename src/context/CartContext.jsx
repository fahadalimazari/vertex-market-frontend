import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import { toast } from 'react-hot-toast'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

const getAuthToken = () => {
  try {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    return session?.token || null;
  } catch (error) {
    console.error('Error parsing auth token', error);
    return null;
  }
};

const getGuestCart = () => {
  try {
    const cart = localStorage.getItem('vertex_guest_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (e) {
    return [];
  }
};

const saveGuestCart = (cart) => {
  localStorage.setItem('vertex_guest_cart', JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  
  const [cartItems, setCartItems] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [cartSummary, setCartSummary] = useState({
    itemsTotal: 0,
    discountTotal: 0,
    couponDiscount: 0,
    shippingFee: 0,
    tax: 0,
    grandTotal: 0,
    currency: 'PKR'
  })
  
  const [loading, setLoading] = useState(true)

  const mergeGuestCart = useCallback(async () => {
    const guestItems = getGuestCart();
    if (!guestItems || guestItems.length === 0) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const itemsToMerge = guestItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }));

      await axios.post('http://127.0.0.1:5000/api/v1/cart/merge', { guestItems: itemsToMerge }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('vertex_guest_cart');
    } catch (error) {
      console.error('Failed to merge guest cart', error);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(true)
    if (!isAuthenticated) {
      const guestItems = getGuestCart();
      setCartItems(guestItems);
      setSavedItems([]);
      
      const total = guestItems.reduce((acc, item) => acc + ((item.unitPrice || 0) * item.quantity), 0);
      setCartSummary({
        itemsTotal: total,
        discountTotal: 0,
        couponDiscount: 0,
        shippingFee: 0,
        tax: 0,
        grandTotal: total,
        currency: 'PKR'
      });
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        setLoading(false)
        return;
      }
      
      const { data } = await axios.get('http://127.0.0.1:5000/api/v1/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setCartItems(data.data.items || [])
        setSavedItems(data.data.savedForLater || [])
        setCartSummary(data.data.summary || {
          itemsTotal: 0,
          discountTotal: 0,
          couponDiscount: 0,
          shippingFee: 0,
          tax: 0,
          grandTotal: 0,
          currency: 'PKR'
        })
      }
    } catch (error) {
      console.error('Failed to fetch user cart', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const initCart = async () => {
      if (isAuthenticated) {
        await mergeGuestCart();
      }
      await fetchCart();
    };
    initCart();
  }, [isAuthenticated, fetchCart, mergeGuestCart])

  const addToCart = useCallback(async (product, quantity = 1, variant = null) => {
    const productId = product._id || product.id;
    const variantId = variant?._id || variant?.id || null;
    
    if (!isAuthenticated) {
      const availableStock = product.stock !== undefined ? product.stock : 100;
      const guestItems = getGuestCart();
      const existingIndex = guestItems.findIndex(item => item.productId === productId && item.variantId === variantId);
      
      let newQuantity = quantity;
      if (existingIndex > -1) {
        newQuantity += guestItems[existingIndex].quantity;
      }

      if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} items are available.`);
        return;
      }

      if (existingIndex > -1) {
        guestItems[existingIndex].quantity = newQuantity;
      } else {
        guestItems.push({
          _id: `guest_${Date.now()}_${Math.random()}`,
          productId,
          variantId,
          quantity,
          unitPrice: product.price || 0,
          snapshotName: product.name,
          snapshotImage: product.image,
          snapshotBrand: product.brand,
          snapshotSKU: product.sku
        });
      }
      
      saveGuestCart(guestItems);
      toast.success('Added to cart!');
      await fetchCart();
      return;
    }

    try {
      const token = getAuthToken();
      // Using /api/v1/cart/items as per backend API definition
      await axios.post('http://127.0.0.1:5000/api/v1/cart/items', {
        productId,
        variantId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to cart!');
      await fetchCart();
    } catch (error) {
      console.error('Add to cart failed', error);
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  }, [isAuthenticated, fetchCart])

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!isAuthenticated) {
      let guestItems = getGuestCart();
      const existingIndex = guestItems.findIndex(item => item._id === itemId);
      
      if (existingIndex > -1) {
        if (quantity <= 0) {
          guestItems.splice(existingIndex, 1);
        } else {
          guestItems[existingIndex].quantity = quantity;
        }
        saveGuestCart(guestItems);
        await fetchCart();
      }
      return;
    }

    try {
      const token = getAuthToken();
      await axios.put(`http://127.0.0.1:5000/api/v1/cart/items/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error) {
      console.error('Update quantity failed', error)
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  }, [isAuthenticated, fetchCart])

  const removeFromCart = useCallback(async (itemId) => {
    if (!isAuthenticated) {
      let guestItems = getGuestCart();
      guestItems = guestItems.filter(item => item._id !== itemId);
      saveGuestCart(guestItems);
      toast.success('Item removed from cart');
      await fetchCart();
      return;
    }

    try {
      const token = getAuthToken();
      await axios.delete(`http://127.0.0.1:5000/api/v1/cart/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item removed from cart');
      await fetchCart();
    } catch (error) {
      console.error('Remove from cart failed', error)
    }
  }, [isAuthenticated, fetchCart])

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      localStorage.removeItem('vertex_guest_cart');
      toast.success('Cart cleared');
      await fetchCart();
      return;
    }

    try {
      const token = getAuthToken();
      await axios.delete('http://127.0.0.1:5000/api/v1/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Cart cleared');
      await fetchCart();
    } catch (error) {
      console.error('Clear cart failed', error)
    }
  }, [isAuthenticated, fetchCart])

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [cartItems])

  const applyCoupon = useCallback(async (code) => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply coupons.');
      return;
    }

    try {
      const token = getAuthToken();
      const { data } = await axios.post('http://127.0.0.1:5000/api/v1/cart/coupon', { code }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Coupon applied successfully!');
        await fetchCart();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to apply coupon';
      toast.error(msg);
    }
  }, [isAuthenticated, fetchCart]);

  const removeCoupon = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const token = getAuthToken();
      const { data } = await axios.delete('http://127.0.0.1:5000/api/v1/cart/coupon', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Coupon removed');
        await fetchCart();
      }
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  }, [isAuthenticated, fetchCart]);

  const updateShippingAddress = useCallback(async (address) => {
    if (!isAuthenticated) return;

    try {
      const token = getAuthToken();
      const { data } = await axios.post('http://127.0.0.1:5000/api/v1/cart/shipping', address, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Shipping calculated successfully!');
        await fetchCart();
      }
    } catch (error) {
      toast.error('Failed to calculate shipping');
    }
  }, [isAuthenticated, fetchCart]);

  const moveToWishlist = useCallback(async (itemId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage your wishlist');
      return;
    }

    try {
      const token = getAuthToken();
      const { data } = await axios.post(`http://127.0.0.1:5000/api/v1/cart/items/wishlist/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Item moved to wishlist');
        await fetchCart();
      }
    } catch (error) {
      toast.error('Failed to move item to wishlist');
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <CartContext.Provider value={{
      cartItems,
      savedItems,
      cartSummary,
      loading,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      updateShippingAddress,
      moveToWishlist,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}
