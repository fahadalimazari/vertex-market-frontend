import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CollectionContext = createContext(null);
const COLLECTIONS_KEY = 'vertex_collections_v1';

export const useCollections = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionProvider');
  }
  return context;
};

export const CollectionProvider = ({ children }) => {
  const [collections, setCollections] = useState(() => {
    try {
      const data = localStorage.getItem(COLLECTIONS_KEY);
      // Initialize with default collections if empty
      const defaultCollections = [
        {
          id: 'col_favorites',
          name: 'My Favorites',
          coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
          products: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      return data ? JSON.parse(data) : defaultCollections;
    } catch (e) {
      console.error('Failed to load collections from localStorage', e);
      return [];
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }, [collections]);

  const validateName = useCallback((name, id = null) => {
    const trimmed = name?.trim();
    if (!trimmed) {
      toast.error('Collection name cannot be empty');
      return false;
    }
    if (trimmed.length > 50) {
      toast.error('Collection name must be under 50 characters');
      return false;
    }
    const isDuplicate = collections.some(col => 
      col.id !== id && col.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`A collection named "${trimmed}" already exists`);
      return false;
    }
    return true;
  }, [collections]);

  const createCollection = useCallback((name) => {
    if (!validateName(name)) return null;

    const newCollection = {
      id: `col_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
      products: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCollections(prev => [...prev, newCollection]);
    toast.success(`Collection "${newCollection.name}" created`);
    return newCollection;
  }, [validateName]);

  const deleteCollection = useCallback((id) => {
    const col = collections.find(c => c.id === id);
    setCollections(prev => prev.filter(c => c.id !== id));
    if (col) {
      toast.success(`Collection "${col.name}" deleted`);
    }
  }, [collections]);

  const renameCollection = useCallback((id, newName) => {
    if (!validateName(newName, id)) return false;

    setCollections(prev => prev.map(col => {
      if (col.id === id) {
        return {
          ...col,
          name: newName.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    }));

    toast.success(`Collection renamed to "${newName.trim()}"`);
    return true;
  }, [validateName]);

  const addToCollection = useCallback((collectionId, product) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        const alreadyExists = col.products.some(p => p.id === product.id);
        if (alreadyExists) {
          toast.error(`${product.name} is already in "${col.name}"`);
          return col;
        }

        const updatedProducts = [product, ...col.products];
        toast.success(`Added ${product.name} to "${col.name}"`);
        return {
          ...col,
          products: updatedProducts,
          coverImage: product.image || col.coverImage,
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    }));
  }, []);

  const removeFromCollection = useCallback((collectionId, productId) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        const product = col.products.find(p => p.id === productId);
        const updatedProducts = col.products.filter(p => p.id !== productId);
        
        // Reset cover image to first item, or default image if empty
        const nextCover = updatedProducts.length > 0 
          ? updatedProducts[0].image 
          : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop';

        if (product) {
          toast.success(`Removed ${product.name} from "${col.name}"`);
        }

        return {
          ...col,
          products: updatedProducts,
          coverImage: nextCover,
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    }));
  }, []);

  const removeAllFromCollection = useCallback((collectionId) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        toast.success(`Cleared all items from "${col.name}"`);
        return {
          ...col,
          products: [],
          coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    }));
  }, []);

  return (
    <CollectionContext.Provider value={{
      collections,
      createCollection,
      deleteCollection,
      renameCollection,
      addToCollection,
      removeFromCollection,
      removeAllFromCollection
    }}>
      {children}
    </CollectionContext.Provider>
  );
};
