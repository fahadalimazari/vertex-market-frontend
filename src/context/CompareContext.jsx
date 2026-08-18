import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CompareContext = createContext(null);
const COMPARE_KEY = 'vertex_compare_v1';

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth() || {};
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const data = localStorage.getItem(COMPARE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load compare list from localStorage', e);
      return [];
    }
  });

  // Sync database compare items to state when logged in
  useEffect(() => {
    if (isAuthenticated && user?.compareItems) {
      const mapped = user.compareItems
        .filter(item => item.productId)
        .map(item => ({
          ...item.productId,
          id: item.productId._id || item.productId.id
        }));
      setCompareItems(mapped);
    }
  }, [user, isAuthenticated]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareItems));
  }, [compareItems]);

  const syncCompareToBackend = async (items) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      const productIds = items.map(item => item._id || item.id);
      await fetch('http://localhost:5000/api/v1/auth/compare', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ productIds })
      });
    } catch (e) {
      console.error('Failed to sync compare list to backend', e);
    }
  };

  const isInCompare = useCallback((productId) => {
    return compareItems.some(item => (item.id === productId || item._id === productId));
  }, [compareItems]);

  const addToCompare = useCallback((product) => {
    const productId = product.id || product._id;
    if (isInCompare(productId)) {
      toast.error(`${product.name} is already in the comparison list`);
      return;
    }

    if (compareItems.length >= 4) {
      toast.error('You can compare up to 4 products.');
      return;
    }

    const item = {
      id: productId,
      _id: productId,
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
      category: product.category,
    };

    const newItems = [...compareItems, item];
    setCompareItems(newItems);
    toast.success(`${product.name} added to comparison`);
    
    if (isAuthenticated) {
      syncCompareToBackend(newItems);
    }
  }, [compareItems, isInCompare, isAuthenticated]);

  const removeFromCompare = useCallback((productId) => {
    const item = compareItems.find(i => i.id === productId || i._id === productId);
    const newItems = compareItems.filter(i => i.id !== productId && i._id !== productId);
    setCompareItems(newItems);
    if (item) {
      toast.success(`${item.name} removed from comparison`);
    }

    if (isAuthenticated) {
      syncCompareToBackend(newItems);
    }
  }, [compareItems, isAuthenticated]);

  const toggleCompare = useCallback((product) => {
    const productId = product.id || product._id;
    if (isInCompare(productId)) {
      removeFromCompare(productId);
    } else {
      addToCompare(product);
    }
  }, [isInCompare, addToCompare, removeFromCompare]);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    toast.success('Comparison list cleared');
    if (isAuthenticated) {
      syncCompareToBackend([]);
    }
  }, [isAuthenticated]);

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      isInCompare,
      toggleCompare,
      clearCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};
