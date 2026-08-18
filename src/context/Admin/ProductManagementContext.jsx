import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductManagementContext = createContext(null);

export const useProductManagement = () => {
  const context = useContext(ProductManagementContext);
  if (!context) {
    throw new Error('useProductManagement must be used within a ProductManagementProvider');
  }
  return context;
};

export const ProductManagementProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (source = 'ADMIN') => {
    try {
      setLoading(true);
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      const { data } = await axios.get(`${apiUrl}/products?visibility=all&source=${source}`);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load admin products list', err);
      toast.error('Failed to load products from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const approveProduct = useCallback(async (id) => {
    try {
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      await axios.put(`${apiUrl}/products/${id}`, { status: 'Approved', isPublished: true });
      setProducts(prev => prev.map(p => 
        p._id === id ? { ...p, status: 'Approved', isPublished: true } : p
      ));
      toast.success('Product listing approved');
    } catch (err) {
      toast.error('Failed to approve product');
    }
  }, []);

  const rejectProduct = useCallback(async (id, reason) => {
    try {
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      await axios.put(`${apiUrl}/products/${id}`, { status: 'Rejected', isPublished: false, rejectionReason: reason });
      setProducts(prev => prev.map(p => 
        p._id === id ? { ...p, status: 'Rejected', isPublished: false, rejectionReason: reason } : p
      ));
      toast.error('Product listing rejected');
    } catch (err) {
      toast.error('Failed to reject product');
    }
  }, []);

  const toggleFeatureProduct = useCallback(async (id) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    try {
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      await axios.put(`${apiUrl}/products/${id}`, { isFeatured: !product.isFeatured });
      setProducts(prev => prev.map(p => 
        p._id === id ? { ...p, isFeatured: !p.isFeatured } : p
      ));
      toast.success('Product featured status updated');
    } catch (error) {
      toast.error('Failed to update product');
    }
  }, [products]);

  const toggleHideProduct = useCallback(async (id) => {
    setProducts(prev => prev.map(p => 
      p._id === id ? { ...p, isHidden: !p.isHidden } : p
    ));
    toast.success('Product visibility status updated');
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      await axios.delete(`${apiUrl}/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product permanently deleted from catalog');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  }, []);

  const duplicateProduct = useCallback(async (id) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    try {
      const { _id, createdAt, updatedAt, __v, slug, ...rest } = product;
      const dup = {
        ...rest,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${Date.now()}`,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`
      };
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      const { data } = await axios.post(`${apiUrl}/products`, dup);
      
      setProducts(prev => [data.data, ...prev]);
      toast.success('Product listing duplicated');
    } catch (error) {
      toast.error('Failed to duplicate product');
    }
  }, [products]);

  const createProduct = useCallback(async (productData) => {
    try {
      const apiUrl = 'http://127.0.0.1:5000/api/v1';
      const { data } = await axios.post(`${apiUrl}/products`, productData);
      
      setProducts(prev => [data.data, ...prev]);
      toast.success('Product created successfully');
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Failed to create product', error);
      toast.error('Failed to create product');
      return { success: false, error: error.message };
    }
  }, []);

  return (
    <ProductManagementContext.Provider value={{
      products,
      loading,
      fetchProducts,
      approveProduct,
      rejectProduct,
      toggleFeatureProduct,
      toggleHideProduct,
      deleteProduct,
      duplicateProduct,
      createProduct,
      refreshProducts: fetchProducts
    }}>
      {children}
    </ProductManagementContext.Provider>
  );
};
