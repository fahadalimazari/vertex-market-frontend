import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';
import { products as mockCatalog } from '../data/products';
import toast from 'react-hot-toast';
import axios from 'axios';

const InventoryContext = createContext(null);
const INVENTORY_KEY = 'vertex_inventory_v1';
const COUPON_KEY = 'vertex_coupons_v1';

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within a InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const { generateNotification } = useNotifications();

  // Load Coupons
  const [coupons, setCoupons] = useState(() => {
    try {
      const data = localStorage.getItem(COUPON_KEY);
      const defaultCoupons = [
        { code: 'VERTEX50', type: 'percentage', value: 50, usageLimit: 100, usedCount: 12, status: 'active' },
        { code: 'FREESHIP', type: 'free_shipping', value: 0, usageLimit: 500, usedCount: 145, status: 'active' }
      ];
      return data ? JSON.parse(data) : defaultCoupons;
    } catch (e) {
      console.error('Failed to load coupons', e);
      return [];
    }
  });

  // Load Products owned by the seller
  const [sellerProducts, setSellerProducts] = useState([]);
  
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        let token = null;
        const sellerSession = JSON.parse(localStorage.getItem('vertex_session_v1') || 'null');
        if (sellerSession?.token) token = sellerSession.token;
        if (!token) {
          const adminSession = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1') || 'null');
          if (adminSession?.token) token = adminSession.token;
        }
        
        if (token) {
          const res = await axios.get('http://127.0.0.1:5000/api/v1/seller/products', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setSellerProducts(res.data.data);
          }
        }
      } catch (e) {
        console.error('Failed to fetch seller products from API', e);
      }
    };
    fetchMyProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(COUPON_KEY, JSON.stringify(coupons));
  }, [coupons]);

  // Product lifecycle functions
  const addProduct = useCallback(async (product) => {
    try {
      // Authenticate with seller token or admin token
      let token = null;
      const sellerSession = JSON.parse(localStorage.getItem('vertex_session_v1') || 'null');
      if (sellerSession?.token) token = sellerSession.token;

      if (!token) {
        const adminSession = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1') || 'null');
        if (adminSession?.token) token = adminSession.token;
      }
      
      const newProductPayload = {
        ...product,
        shortDescription: product.description || 'No description provided.',
        slug: product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random()*1000) : `product-${Date.now()}`,
        price: Number(product.price) || 0,
        discount: Number(product.discount) || 0,
        stock: Number(product.stock),
        lowStockAlert: Number(product.lowStockAlert || 5),
        freeShipping: product.freeShipping === true,
        isNewArrival: product.isNewArrival === true,
        estimatedDelivery: product.estimatedDelivery,
        sold: Number(product.sold) || 0
      };

      // Ensure SKU exists
      if (!newProductPayload.sku) {
        newProductPayload.sku = `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const res = await axios.post('http://127.0.0.1:5000/api/v1/products', newProductPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSellerProducts(prev => [res.data.data, ...prev]);
        toast.success('Product submitted for review successfully!');

        // Check low stock warning inline
        if (res.data.data.stock < res.data.data.lowStockAlert) {
          generateNotification(
            "Low Stock Warning",
            `Product "${res.data.data.name}" (SKU: ${res.data.data.sku}) is running low on stock. Current balance: ${res.data.data.stock}.`,
            "wishlist",
            "high",
            "/seller/products"
          );
        }
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create product');
    }
  }, [generateNotification]);

  const updateProduct = useCallback((id, updatedData) => {
    setSellerProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = { ...p, ...updatedData, stock: Number(updatedData.stock) };
        if (next.stock < next.lowStockAlert) {
          generateNotification(
            "Low Stock Warning",
            `Product "${next.name}" (SKU: ${next.sku}) is running low on stock. Current balance: ${next.stock}.`,
            "wishlist",
            "high",
            "/seller/products"
          );
        }
        return next;
      }
      return p;
    }));
    toast.success('Product updated successfully!');
  }, [generateNotification]);

  const deleteProduct = useCallback((id) => {
    const item = sellerProducts.find(p => p.id === id);
    setSellerProducts(prev => prev.filter(p => p.id !== id));
    if (item) {
      toast.success(`Product "${item.name}" deleted successfully`);
    }
  }, [sellerProducts]);

  const duplicateProduct = useCallback((id) => {
    const product = sellerProducts.find(p => p.id === id);
    if (!product) return;

    const dup = {
      ...product,
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      name: `${product.name} (Copy)`,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };

    setSellerProducts(prev => [dup, ...prev]);
    toast.success(`Duplicated "${product.name}"`);
  }, [sellerProducts]);

  const changeStock = useCallback((id, newStock) => {
    setSellerProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = { ...p, stock: Number(newStock) };
        if (next.stock < next.lowStockAlert) {
          generateNotification(
            "Low Stock Warning",
            `Product "${next.name}" (SKU: ${next.sku}) has reached low stock: ${next.stock}.`,
            "wishlist",
            "high",
            "/seller/products"
          );
        }
        return next;
      }
      return p;
    }));
  }, [generateNotification]);

  // Coupon actions
  const addCoupon = useCallback((coupon) => {
    const newCoupon = {
      ...coupon,
      usedCount: 0,
      status: 'active'
    };
    setCoupons(prev => [newCoupon, ...prev]);
    toast.success(`Coupon ${coupon.code} created successfully`);
    
    generateNotification(
      "New Coupon Code Released",
      `Apply code "${coupon.code}" for exclusive seller discounts. Valid from ${coupon.startDate} to ${coupon.endDate}.`,
      "promotions",
      "medium",
      "/seller/coupons"
    );
  }, [generateNotification]);

  const deleteCoupon = useCallback((code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    toast.success(`Coupon ${code} deleted`);
  }, []);

  return (
    <InventoryContext.Provider value={{
      sellerProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      changeStock,
      coupons,
      addCoupon,
      deleteCoupon
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
