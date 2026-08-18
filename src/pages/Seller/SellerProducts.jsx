import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiCopy, FiCheck, 
  FiEye, FiImage, FiTrendingUp, FiSettings, FiSliders 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';
import attributeService from '../../services/attributeService';
import DynamicFormRenderer from '../../components/DynamicForm/DynamicFormRenderer';

const SellerProducts = () => {
  const { sellerProducts, addProduct, updateProduct, deleteProduct, duplicateProduct } = useInventory();
  const location = useLocation();
  
  // Add/Edit Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null means adding
  const [formStep, setFormStep] = useState(1);
  const [formValues, setFormValues] = useState({
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop',
    price: '',
    oldPrice: '',
    discount: '0',
    stock: '',
    lowStockAlert: '5',
    sku: '',
    warehouse: 'Karachi Warehouse',
    rating: 4.5,
    reviews: 12,
    freeShipping: false,
    isNewArrival: true,
    estimatedDelivery: '3-5 Days',
    sold: 0
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true);
    }
  }, [location]);

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.success) {
        setFormValues(prev => ({ ...prev, image: 'http://localhost:5000' + data.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, active, lowStock
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [categories, setCategories] = useState([]);

  // Dynamic attributes states
  const [dynamicAttributesList, setDynamicAttributesList] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({});

  const handleDynamicChange = (attrId, value) => {
    setDynamicValues(prev => ({ ...prev, [attrId]: value }));
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getActiveCategories();
        setCategories(Array.isArray(data) ? data : (data?.data || []));
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    loadCategories();
  }, []);

  const [subCategories, setSubCategories] = useState([]);

  // Fetch dynamic attributes when subcategory changes
  useEffect(() => {
    const fetchAttrs = async () => {
      if (formValues.subCategory) {
        try {
          const data = await attributeService.getAttributesBySubCategory(formValues.subCategory);
          setDynamicAttributesList(Array.isArray(data) ? data : (data?.data || []));
        } catch (e) {
          setDynamicAttributesList([]);
        }
      } else {
        setDynamicAttributesList([]);
      }
    };
    fetchAttrs();
  }, [formValues.subCategory]);

  useEffect(() => {
    const fetchSubCats = async () => {
      if (formValues.category) {
        try {
          const data = await subCategoryService.getSubCategoriesByCategory(formValues.category);
          setSubCategories(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
          setSubCategories([]);
        }
      } else {
        setSubCategories([]);
      }
    };
    fetchSubCats();
  }, [formValues.category]);

  // When dynamicAttributesList loads, populate values if editing
  useEffect(() => {
    if (editProduct && editProduct.specifications && dynamicAttributesList.length > 0) {
      const existingValues = {};
      editProduct.specifications.forEach(section => {
        if (section.specs) {
          section.specs.forEach(spec => {
            const attrDef = dynamicAttributesList.find(a => a.name === spec.name || a.code === spec.name);
            if (attrDef) {
              existingValues[attrDef._id] = spec.value;
            }
          });
        }
      });
      setDynamicValues(existingValues);
    }
  }, [dynamicAttributesList, editProduct]);


  const handleOpenForm = (prod = null) => {
    if (prod) {
      setEditProduct(prod);
      setFormValues({ ...prod });
      // dynamicValues will be populated by the useEffect when attributes load
    } else {
      setEditProduct(null);
      setDynamicValues({});
      setFormValues({
        name: '',
        brand: '',
        category: '',
        subCategory: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop',
        price: '',
        oldPrice: '',
        discount: '0',
        stock: '',
        lowStockAlert: '5',
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        warehouse: 'Karachi Warehouse',
        rating: 4.5,
        reviews: 0,
        freeShipping: false,
        isNewArrival: true,
        estimatedDelivery: '3-5 Days',
        sold: 0
      });
    }
    setFormStep(1);
    setIsFormOpen(true);
  };

  const handleInputChange = (field, val) => {
    setFormValues(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    // map dynamic attributes to specifications schema
    const specs = Object.keys(dynamicValues).map(key => {
      const attrDef = dynamicAttributesList.find(a => a._id === key || a.code === key);
      let finalValue = dynamicValues[key];
      
      // If the field is a Dropdown or Radio, the stored value might be the option's _id
      if (attrDef && attrDef.values && Array.isArray(attrDef.values)) {
        const selectedOption = attrDef.values.find(v => v._id === finalValue);
        if (selectedOption) {
          finalValue = selectedOption.value || selectedOption.label;
        }
      }

      return {
        name: attrDef ? attrDef.name : key,
        value: finalValue
      };
    });
    
    const payload = {
      ...formValues,
      specifications: specs.length > 0 ? [{ section: 'General', specs }] : []
    };

    if (editProduct) {
      updateProduct(editProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsFormOpen(false);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return sellerProducts.filter(prod => {
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeTab === 'active' && !prod.isActive) return false;
      if (activeTab === 'lowStock' && prod.stock >= prod.lowStockAlert) return false;

      return true;
    });
  }, [sellerProducts, searchQuery, activeTab]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-full">
      {/* Onboarding Form Modal */}
      {isFormOpen ? (
        <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-3 gap-3">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {editProduct ? 'Edit Catalog Product' : 'Add New Product Listing'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Multi-step validation form.</p>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-1.5 border border-gray-200 text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shrink-0 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>

          {/* Form Step Buttons */}
          <div className="flex flex-wrap gap-2 justify-between border-b border-gray-100 pb-3 text-[11px] sm:text-xs font-bold text-gray-500">
            {['1. Details', '2. Pricing', '3. Inventory', '4. Review'].map((label, idx) => (
              <span key={idx} className={formStep === idx + 1 ? 'text-[#ff6a00]' : ''}>
                {label}
              </span>
            ))}
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-5">
            {/* Step 1: Details */}
            {formStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formValues.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Mechanical Gaming Keyboard v2"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Brand</label>
                    <input
                      type="text"
                      required
                      value={formValues.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="e.g. VertexGears"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={formValues.category}
                      onChange={(e) => {
                        handleInputChange('category', e.target.value);
                        handleInputChange('subCategory', '');
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Sub Category</label>
                    <select
                      value={formValues.subCategory}
                      onChange={(e) => handleInputChange('subCategory', e.target.value)}
                      disabled={!formValues.category}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      {!formValues.category ? (
                        <option value="">Select Category First</option>
                      ) : (
                        <>
                          <option value="">Select Sub Category</option>
                          {subCategories.map(sub => (
                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Product Image</label>
                    <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 transition-colors bg-gray-50 flex items-center justify-center p-2 overflow-hidden" style={{ height: '42px' }}>
                      <input 
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-orange-500 transition-colors z-0">
                        {isUploading ? (
                          <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiImage />
                        )}
                        <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                      </div>
                    </div>
                    {formValues.image && !formValues.image.includes('unsplash') && (
                      <div className="mt-2 text-[10px] text-green-600 font-bold flex items-center gap-1">
                        <FiCheck size={12} /> Image Selected
                      </div>
                    )}
                  </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formValues.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide features, specifications list, and package sizes..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs resize-none"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Dynamic Specifications</h4>
                  {!formValues.subCategory ? (
                     <p className="text-xs text-gray-500">Please select a Sub Category to load dynamic attributes.</p>
                  ) : dynamicAttributesList.length === 0 ? (
                     <p className="text-xs text-gray-500">No dynamic attributes configured for this Sub Category.</p>
                  ) : (
                    <div className="bg-orange-50/30 p-4 rounded-xl border border-orange-100/50">
                      <DynamicFormRenderer 
                        attributes={dynamicAttributesList} 
                        values={dynamicValues} 
                        onChange={handleDynamicChange} 
                      />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Step 2: Pricing */}
            {formStep === 2 && (
              <div className="space-y-4 w-full min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Selling Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={formValues.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Retail Old Price (Rs.)</label>
                    <input
                      type="number"
                      value={formValues.oldPrice}
                      onChange={(e) => handleInputChange('oldPrice', e.target.value)}
                      placeholder="e.g. 18000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Discount (%)</label>
                    <input
                      type="number"
                      value={formValues.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formValues.freeShipping}
                      onChange={(e) => handleInputChange('freeShipping', e.target.checked)}
                      className="w-4 h-4 text-[#ff6a00] border-gray-300 rounded focus:ring-[#ff6a00]"
                    />
                    Provide Free Shipping for this product
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formValues.isNewArrival}
                      onChange={(e) => handleInputChange('isNewArrival', e.target.checked)}
                      className="w-4 h-4 text-[#ff6a00] border-gray-300 rounded focus:ring-[#ff6a00]"
                    />
                    Mark as "New Arrival" (Shows NEW badge)
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Inventory */}
            {formStep === 3 && (
              <div className="space-y-4 w-full min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Initial Stock Level</label>
                    <input
                      type="number"
                      required
                      value={formValues.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Low Stock Alert Trigger</label>
                    <input
                      type="number"
                      required
                      value={formValues.lowStockAlert}
                      onChange={(e) => handleInputChange('lowStockAlert', e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">SKU Identifier</label>
                    <input
                      type="text"
                      required
                      value={formValues.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="e.g. SKU-8032"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Estimated Delivery</label>
                    <input
                      type="text"
                      required
                      value={formValues.estimatedDelivery}
                      onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                      placeholder="e.g. Tomorrow or 3-5 Days"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Initial Sold Count (Optional)</label>
                    <input
                      type="number"
                      value={formValues.sold}
                      onChange={(e) => handleInputChange('sold', e.target.value)}
                      placeholder="e.g. 2100"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Warehouse Center</label>
                    <input
                      type="text"
                      required
                      value={formValues.warehouse}
                      onChange={(e) => handleInputChange('warehouse', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {formStep === 4 && (
              <div className="space-y-4 bg-gray-50 p-4 border border-gray-150 rounded-2xl text-xs text-gray-700 space-y-2">
                <h4 className="font-bold text-gray-900 text-sm">Review Product Specifications</h4>
                <p><strong>Name:</strong> {formValues.name}</p>
                <p><strong>Brand:</strong> {formValues.brand} ({formValues.category})</p>
                <p><strong>Pricing:</strong> Rs. {Number(formValues.price).toLocaleString()} {formValues.discount > 0 && `(-${formValues.discount}%)`}</p>
                <p><strong>SKU Stock:</strong> {formValues.stock} units (Warehouse: {formValues.warehouse})</p>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              {formStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(prev => prev - 1)}
                  className="px-4.5 py-2 border border-gray-200 text-xs font-bold text-gray-750 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {formStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(prev => prev + 1)}
                  className="px-5 py-2 bg-[#ff6a00] text-white text-xs font-bold rounded-xl hover:bg-[#e05e00]"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 shadow-sm"
                >
                  Publish Listing
                </button>
              )}
            </div>

          </form>
        </div>
      ) : (
        <>
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Inventory Products</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage, update, and search active catalog listings.</p>
            </div>
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center justify-center gap-1.5 bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md w-full sm:w-auto shrink-0"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Filtering Tabs & Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 border border-gray-100 rounded-2xl shadow-sm min-w-0">
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'active', label: 'Active listings' },
                { id: 'lowStock', label: 'Low Stock' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-50 border-[#ff6a00]/30 text-[#ff6a00]'
                      : 'bg-white border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs w-full bg-gray-50/20"
                placeholder="Search products by SKU or Name..."
              />
            </div>
          </div>

          {/* Products Table list */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-w-0 w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <th className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 whitespace-normal sm:whitespace-nowrap">Details</th>
                    <th className="hidden md:table-cell px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">SKU</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Price</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Stock</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Status</th>
                    <th className="hidden lg:table-cell px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Warehouse</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-4 text-center whitespace-normal sm:whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
                  {paginatedProducts.map((prod) => {
                    const isLow = prod.stock < prod.lowStockAlert;
                    return (
                      <tr key={prod.id} className="hover:bg-gray-50/30 transition-colors">
                        {/* Title details */}
                        <td className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 whitespace-normal sm:whitespace-nowrap">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 bg-gray-50 border border-gray-100 rounded p-1 flex items-center justify-center">
                              <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="min-w-0 w-[80px] sm:w-auto sm:max-w-[200px]">
                              <p className="font-bold text-gray-900 truncate text-[10px] sm:text-xs">{prod.name}</p>
                              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider truncate">{prod.brand}</p>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="hidden sm:table-cell px-1 sm:px-4 py-2 sm:py-4 font-mono font-bold text-gray-800 text-[10px] sm:text-xs">{prod.sku}</td>

                        {/* Price */}
                        <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900 text-[10px] sm:text-xs">Rs. {prod.price.toLocaleString()}</td>

                        {/* Stock */}
                        <td className="px-1 sm:px-4 py-2 sm:py-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                            isLow 
                              ? 'bg-red-50 text-red-600 animate-pulse' 
                              : 'bg-green-50 text-green-600'
                          }`}>
                            {prod.stock} Units {isLow && '(Low)'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-1 sm:px-4 py-2 sm:py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 rounded font-bold text-[8px] sm:text-[10px] uppercase w-max ${
                              prod.status === 'Approved' || prod.status === 'Published' || prod.status === 'Active' ? 'bg-green-100 text-green-700' :
                              prod.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              prod.status === 'Suspended' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700' // Pending
                            }`}>
                              {prod.status}
                            </span>
                            {prod.status === 'Rejected' && prod.rejectionReason && (
                              <span className="text-[9px] text-red-500 font-medium max-w-[120px] truncate" title={prod.rejectionReason}>
                                {prod.rejectionReason}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Warehouse */}
                        <td className="hidden lg:table-cell px-1 sm:px-4 py-2 sm:py-4 text-gray-500">{prod.warehouse || 'Central'}</td>

                        {/* Actions */}
                        <td className="px-1 sm:px-4 py-2 sm:py-4 text-center">
                          <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleOpenForm(prod)}
                              className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors shrink-0"
                              title="Edit listing"
                            >
                              <FiEdit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => duplicateProduct(prod.id)}
                              className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-[#ff6a00] transition-colors shrink-0"
                              title="Duplicate listing"
                            >
                              <FiCopy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => window.confirm('Permanently delete this product?') && deleteProduct(prod.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors shrink-0"
                              title="Delete permanently"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-400">
                        No catalog listings match active query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 disabled:opacity-50 hover:bg-white transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 disabled:opacity-50 hover:bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SellerProducts;
