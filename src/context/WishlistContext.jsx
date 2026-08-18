import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const WISHLIST_KEY = 'vertex_wishlist_v1';

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

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { generateNotification } = useNotifications();
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGuestWishlist = () => {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  const saveGuestWishlist = (items) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  };

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    if (isAuthenticated) {
      try {
        const token = getAuthToken();
        if (token) {
          const { data } = await axios.get('http://127.0.0.1:5000/api/v1/wishlist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setWishlist(data.data || []);
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist', error);
      }
    } else {
      setWishlist(getGuestWishlist());
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Optionally merge wishlist on login
  useEffect(() => {
    const mergeWishlist = async () => {
      if (isAuthenticated) {
        const local = getGuestWishlist();
        if (local.length > 0) {
          const token = getAuthToken();
          if (token) {
            // Ideally a bulk merge, but we'll do one by one for now
            for (let item of local) {
              try {
                await axios.post('http://127.0.0.1:5000/api/v1/wishlist', {
                  productId: item.id || item.productId,
                  variantId: item.variantId || null
                }, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              } catch (e) {
                // Ignore duplicates
              }
            }
            localStorage.removeItem(WISHLIST_KEY);
            fetchWishlist();
          }
        }
      }
    };
    mergeWishlist();
  }, [isAuthenticated, fetchWishlist]);

  const isInWishlist = useCallback((productId) => {
    const strId = String(productId);
    if (isAuthenticated) {
      return wishlist.some(item => String(item.productId) === strId);
    }
    return wishlist.some(item => String(item.id) === strId || String(item.productId) === strId);
  }, [wishlist, isAuthenticated]);

  const addToWishlist = useCallback(async (product, variant = null) => {
    if (isInWishlist(product.id || product._id)) return;

    if (isAuthenticated) {
      try {
        const token = getAuthToken();
        const { data } = await axios.post('http://127.0.0.1:5000/api/v1/wishlist', {
          productId: product._id || product.id,
          variantId: variant?._id || variant?.id || null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          toast.success(`${product.name} added to wishlist`);
          fetchWishlist();
        }
      } catch (error) {
        console.error('Failed to add to wishlist', error);
        const errorMsg = error.response?.data?.message;
        if (errorMsg === 'Item already in wishlist') {
          // It's already there, just fetch to sync
          fetchWishlist();
        } else {
          toast.error(errorMsg || 'Failed to add to wishlist');
        }
      }
    } else {
      const wishItem = {
        id: product._id || product.id,
        productId: product._id || product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        price: product.price,
        oldPrice: product.oldPrice,
        discount: product.discount,
        rating: product.rating,
        reviews: product.reviews,
        stock: product.stock,
        image: product.image,
        addedAt: new Date().toISOString()
      };

      const newWishlist = [wishItem, ...wishlist];
      setWishlist(newWishlist);
      saveGuestWishlist(newWishlist);
      toast.success(`${product.name} added to wishlist`);
    }

    // AI Notifications Mock
    setTimeout(() => {
      generateNotification(
        `Price Drop Alert!`,
        `The price of "${product.name}" has dropped. Buy it now.`,
        "wishlist",
        "high",
        `/product/${product.slug}`
      );
    }, 4000);
  }, [isInWishlist, generateNotification, isAuthenticated, fetchWishlist, wishlist]);


  const removeFromWishlist = useCallback(async (identifier) => {
    // identifier could be wishlist _id (authenticated) or productId (guest)
    if (isAuthenticated) {
      try {
        const strId = String(identifier);
        // Find the specific item ID by productId
        const item = wishlist.find(i => String(i.productId) === strId || String(i._id) === strId);
        if (item) {
          const token = getAuthToken();
          await axios.delete(`http://127.0.0.1:5000/api/v1/wishlist/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(`Removed from wishlist`);
          fetchWishlist();
        }
      } catch (error) {
        console.error('Error removing from wishlist', error);
        toast.error(error.response?.data?.message || 'Error removing from wishlist');
      }
    } else {
      const strId = String(identifier);
      const newWishlist = wishlist.filter(i => String(i.id) !== strId && String(i.productId) !== strId);
      setWishlist(newWishlist);
      saveGuestWishlist(newWishlist);
      toast.success(`Removed from wishlist`);
    }
  }, [wishlist, isAuthenticated, fetchWishlist]);

  const toggleWishlist = useCallback((product) => {
    if (isInWishlist(product.id || product._id)) {
      removeFromWishlist(product.id || product._id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    // Not explicitly in requirements to clear all from backend at once, we can loop or do local
    if (!isAuthenticated) {
      setWishlist([]);
      localStorage.removeItem(WISHLIST_KEY);
      toast.success('Wishlist cleared');
    }
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      refreshWishlist: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
