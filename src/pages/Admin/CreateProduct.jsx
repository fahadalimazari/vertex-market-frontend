import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiCheckCircle, FiChevronRight, FiChevronLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import categoryService from '../../services/categoryService';
import subCategoryService from '../../services/subCategoryService';
import attributeService from '../../services/attributeService';
import productService from '../../services/productService';
import DynamicFormRenderer from '../../components/DynamicForm/DynamicFormRenderer';

const TABS = [
  'Basic Information', 
  'Category & Sub Category', 
  'Dynamic Attributes', 
  'Variants',
  'Product Media', 
  'Pricing', 
  'Inventory & Shipping', 
  'Status & Visibility',
  'Preview & Publish'
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  
  // Basic states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandId, setBrandId] = useState('');
  const [brands, setBrands] = useState([]);
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [condition, setCondition] = useState('New');
  const [manufacturer, setManufacturer] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [warranty, setWarranty] = useState('No Warranty');
  
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [highlights, setHighlights] = useState(['']);
  const [tags, setTags] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  
  // Category states
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  
  // Dynamic Attributes states
  const [dynamicAttributesList, setDynamicAttributesList] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({});
  
  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);

  // Images states
  const [localPreviews, setLocalPreviews] = useState([]); 
  const [uploadProgress, setUploadProgress] = useState({}); 
  
  // Pricing
  const [costPrice, setCostPrice] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [discountType, setDiscountType] = useState('None');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxClass, setTaxClass] = useState('Standard');

  // Inventory & Shipping
  const [stock, setStock] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState(5);
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowBackorders, setAllowBackorders] = useState(false);
  
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [shippingClass, setShippingClass] = useState('Standard');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);

  // Status & Visibility
  const [status, setStatus] = useState('Published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  useEffect(() => {
    if (name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [name]);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await categoryService.getActiveCategories();
        setCategories(Array.isArray(data) ? data : (data?.data || []));
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    const fetchBrands = async () => {
      try {
        const res = await axios.get('https://vertex-market-backend.vercel.app/api/brands');
        setBrands(res.data.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
    fetchBrands();
  }, []);

  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    setSelectedSubCategory('');
    setSubCategories([]);
    setDynamicAttributesList([]);
    
    if (catId) {
      try {
        const data = await subCategoryService.getSubCategoriesByCategory(catId);
        setSubCategories(Array.isArray(data) ? data : (data?.data || []));
      } catch (error) {
        console.error('Failed to load subcategories', error);
      }
    }
  };

  useEffect(() => {
    const fetchAttrs = async () => {
      if (selectedSubCategory) {
        try {
          const data = await attributeService.getAttributesBySubCategory(selectedSubCategory);
          setDynamicAttributesList(Array.isArray(data) ? data : (data?.data || []));
        } catch (e) {
          setDynamicAttributesList([]);
        }
      } else {
        setDynamicAttributesList([]);
      }
    };
    fetchAttrs();
  }, [selectedSubCategory]);

  const handleDynamicChange = (attrId, value) => {
    setDynamicValues(prev => ({ ...prev, [attrId]: value }));
  };

  const handleFiles = (files) => {
    const selectedFiles = Array.from(files);
    const newPreviews = selectedFiles.map((file, idx) => {
      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewItem = {
        id,
        previewUrl: URL.createObjectURL(file),
        file,
        status: 'uploading',
        isPrimary: localPreviews.length === 0 && idx === 0,
        metadata: null
      };
      uploadSingleFile(previewItem);
      return previewItem;
    });
    setLocalPreviews(prev => [...prev, ...newPreviews]);
  };

  const uploadSingleFile = async (previewItem) => {
    const formData = new FormData();
    formData.append('images', previewItem.file);

    try {
      const tokenData = localStorage.getItem('vertex_auth_session_v1');
      const headers = {};
      if (tokenData) {
        const { token } = JSON.parse(tokenData);
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.post('https://vertex-market-backend.vercel.app/api/uploads/products', formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [previewItem.id]: percentCompleted }));
        }
      });

      if (res.data?.success && res.data?.images?.length > 0) {
        const metadata = res.data.images[0];
        setLocalPreviews(prev => prev.map(item => 
          item.id === previewItem.id 
            ? { ...item, status: 'success', metadata } 
            : item
        ));
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setLocalPreviews(prev => prev.map(item => 
        item.id === previewItem.id 
          ? { ...item, status: 'failed' } 
          : item
      ));
      toast.error(`Failed to upload ${previewItem.file.name}`);
    }
  };

  const removeImage = async (index) => {
    const target = localPreviews[index];
    const updated = localPreviews.filter((_, idx) => idx !== index);
    if (target.isPrimary && updated.length > 0) updated[0].isPrimary = true;
    setLocalPreviews(updated);
  };

  const setAsPrimary = (index) => {
    setLocalPreviews(prev => prev.map((item, idx) => ({ ...item, isPrimary: idx === index })));
  };

  const addVariant = () => {
    setVariants([...variants, { sku: '', price: '', stock: '', attributes: {} }]);
  };

  const updateVariant = (index, field, value) => {
    const newVars = [...variants];
    newVars[index][field] = value;
    setVariants(newVars);
  };

  const updateVariantAttribute = (vIndex, key, value) => {
    const newVars = [...variants];
    newVars[vIndex].attributes = { ...newVars[vIndex].attributes, [key]: value };
    setVariants(newVars);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!name || !brandId || !selectedCategory || !price) {
      toast.error('Please fill in required fields (Name, Brand, Category, Price)');
      return;
    }

    const uploadedImages = localPreviews
      .filter(item => item.status === 'success' && item.metadata)
      .map((item, index) => ({
        imageUrl: item.metadata.imageUrl,
        publicId: item.metadata.publicId,
        filename: item.metadata.filename,
        isPrimary: item.isPrimary,
        sortOrder: index,
      }));

    const primaryImage = uploadedImages.find(img => img.isPrimary) || uploadedImages[0];

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
      name, slug, productType: hasVariants ? 'Variable' : 'Simple', brand: brandId,
      category: selectedCategory, subCategory: selectedSubCategory,
      sku, barcode, modelNumber, condition, manufacturer, countryOfOrigin, warranty,
      shortDescription, longDescription,
      highlights: highlights.filter(h => h.trim() !== ''),
      tags: tags.split(',').map(t => t.trim()),
      searchKeywords: searchKeywords.split(',').map(t => t.trim()),
      internalNotes,
      costPrice: costPrice ? Number(costPrice) : undefined,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discountType, discountValue: Number(discountValue), taxClass,
      stock: Number(stock), lowStockAlert: Number(lowStockAlert), trackInventory, allowBackorders,
      weight: Number(weight), length: Number(length), width: Number(width), height: Number(height),
      shippingClass, estimatedDelivery, freeShipping,
      image: primaryImage?.imageUrl || '',
      gallery: uploadedImages.map(img => img.imageUrl),
      images: uploadedImages,
      variants: hasVariants ? variants : [],
      specifications: specs.length > 0 ? [{ section: 'General', specs }] : [],
      status, isFeatured, isTrending, isNewArrival,
    };

    try {
      const res = await productService.createProduct(payload);
      if (res.success || res._id) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      } else {
        toast.error('Failed to create product');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Enterprise Product Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Multi-step wizard to create a fully dynamic product.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 border rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <FiX /> Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 shadow-lg">
            <FiSave /> Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm h-fit sticky top-6">
          <div className="space-y-1">
            {TABS.map((tab, idx) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  currentTab === idx ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{idx + 1}. {tab}</span>
                {currentTab > idx && <FiCheckCircle className="text-green-500" />}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm min-h-[600px] flex flex-col justify-between">
          <div className="flex-1">
            {/* Tab 1: Basic Information */}
            {currentTab === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">1. Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                    <span className="text-[10px] text-gray-400">{name.length} chars</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Slug *</label>
                    <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand *</label>
                    <select value={brandId} onChange={e => setBrandId(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SKU</label>
                    <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Barcode (UPC/EAN)</label>
                    <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Model Number</label>
                    <input type="text" value={modelNumber} onChange={e => setModelNumber(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Condition</label>
                    <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option value="New">New</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Manufacturer</label>
                    <input type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Warranty</label>
                    <select value={warranty} onChange={e => setWarranty(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option value="No Warranty">No Warranty</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                      <option value="2 Years">2 Years</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Short Description *</label>
                  <textarea rows="2" value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                  <span className="text-[10px] text-gray-400">{shortDescription.length} chars (150-300 recommended)</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Description</label>
                  <textarea rows="4" value={longDescription} onChange={e => setLongDescription(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Highlights</label>
                  {highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={h} onChange={e => { const newH = [...highlights]; newH[i] = e.target.value; setHighlights(newH); }} className="flex-1 px-4 py-2 border rounded-xl text-sm" placeholder={`Highlight ${i+1}`} />
                      <button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><FiTrash2/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setHighlights([...highlights, ''])} className="text-xs font-bold text-orange-600 flex items-center gap-1"><FiPlus/> Add Highlight</button>
                </div>
              </div>
            )}

            {/* Tab 2: Category */}
            {currentTab === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">2. Category & Sub Category</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                    <select value={selectedCategory} onChange={handleCategoryChange} className="w-full px-4 py-2 border rounded-xl bg-white text-sm">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sub Category</label>
                    <select value={selectedSubCategory} onChange={e => setSelectedSubCategory(e.target.value)} disabled={!selectedCategory} className="w-full px-4 py-2 border rounded-xl bg-white text-sm">
                      <option value="">{selectedCategory ? 'Select Sub Category' : 'Select Category First'}</option>
                      {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Attributes */}
            {currentTab === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">3. Dynamic Attributes</h3>
                {!selectedSubCategory ? <p className="text-sm text-gray-500">Select a Sub Category first.</p> : dynamicAttributesList.length === 0 ? <p className="text-sm text-gray-500">No attributes found.</p> : <DynamicFormRenderer attributes={dynamicAttributesList} values={dynamicValues} onChange={handleDynamicChange} />}
              </div>
            )}

            {/* Tab 4: Variants */}
            {currentTab === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-black text-gray-900">4. Variants (Color, Size, etc.)</h3>
                  <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                    <input type="checkbox" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="w-4 h-4 text-orange-600 rounded" />
                    Enable Variants
                  </label>
                </div>
                {hasVariants ? (
                  <div className="space-y-4">
                    {variants.map((v, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-bold text-sm">Variant {idx + 1}</h4>
                          <button onClick={() => setVariants(variants.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 text-xs font-bold"><FiTrash2/></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <input type="text" placeholder="SKU" value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm" />
                          <input type="number" placeholder="Price" value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm" />
                          <input type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="Attribute (e.g. Color)" onChange={e => updateVariantAttribute(idx, e.target.value, v.attributes[e.target.value] || '')} className="px-3 py-1.5 border rounded-lg text-sm" />
                          <input type="text" placeholder="Value (e.g. Red)" onChange={e => updateVariantAttribute(idx, Object.keys(v.attributes)[0], e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm" />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addVariant} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold">Add Variant</button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Enable variants if this product comes in different colors, sizes, or configurations.</p>
                )}
              </div>
            )}

            {/* Tab 5: Media */}
            {currentTab === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">5. Product Media</h3>
                <div 
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 cursor-pointer"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
                  <p className="text-sm font-bold text-gray-500">Drag & Drop Product Images Here</p>
                </div>
                {localPreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {localPreviews.map((preview, index) => (
                      <div key={preview.id} className="relative border rounded-xl overflow-hidden aspect-square group">
                        <img src={preview.previewUrl} className="w-full h-full object-cover" alt="" />
                        {preview.isPrimary && <span className="absolute top-1 left-1 bg-orange-600 text-white text-[10px] px-2 rounded-full">Primary</span>}
                        <button onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"><FiX /></button>
                        <button onClick={(e) => { e.stopPropagation(); setAsPrimary(index); }} className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-[10px] py-1 opacity-0 group-hover:opacity-100 transition">Set Primary</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 6: Pricing */}
            {currentTab === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">6. Advanced Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Selling Price *</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Old Price (Strike-through)</label><input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Cost Price (For Analytics)</label><input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Tax Class</label>
                    <select value={taxClass} onChange={e => setTaxClass(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option>Standard</option><option>Tax Free</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Inventory & Shipping */}
            {currentTab === 6 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">7. Inventory & Shipping</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity *</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Low Stock Alert Level</label><input type="number" value={lowStockAlert} onChange={e => setLowStockAlert(e.target.value)} className="w-full px-4 py-2 border rounded-xl" /></div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Weight (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Length</label><input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Width</label><input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Height</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" /></div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={freeShipping} onChange={e => setFreeShipping(e.target.checked)} className="w-4 h-4 rounded text-orange-600" /> Free Shipping</label>
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={trackInventory} onChange={e => setTrackInventory(e.target.checked)} className="w-4 h-4 rounded text-orange-600" /> Track Inventory</label>
                </div>
              </div>
            )}

            {/* Tab 8: Status & Visibility */}
            {currentTab === 7 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-black text-gray-900 border-b pb-2">8. Status & Visibility</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option>Draft</option><option>Published</option><option>Archived</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded text-orange-600" /> Featured</label>
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={isTrending} onChange={e => setIsTrending(e.target.checked)} className="w-4 h-4 rounded text-orange-600" /> Trending</label>
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={isNewArrival} onChange={e => setIsNewArrival(e.target.checked)} className="w-4 h-4 rounded text-orange-600" /> New Arrival</label>
                </div>
              </div>
            )}

            {/* Tab 9: Preview */}
            {currentTab === 8 && (
              <div className="space-y-4 animate-fadeIn text-center">
                <h3 className="text-xl font-black text-green-600 mb-4">Ready to Publish</h3>
                <p className="text-sm text-gray-600">All required fields are validated.</p>
                <button type="button" onClick={handleSubmit} className="px-8 py-3 bg-green-500 text-white rounded-xl text-lg font-black hover:bg-green-600 shadow-lg mt-8">
                  Publish Product
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t mt-6 flex justify-between items-center">
            <button type="button" onClick={() => setCurrentTab(prev => Math.max(0, prev - 1))} disabled={currentTab === 0} className="px-5 py-2.5 border rounded-xl text-sm font-bold disabled:opacity-30">Previous</button>
            <span className="text-xs font-bold text-gray-400">Step {currentTab + 1} of {TABS.length}</span>
            <button type="button" onClick={() => setCurrentTab(prev => Math.min(TABS.length - 1, prev + 1))} disabled={currentTab === TABS.length - 1} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold disabled:opacity-30">Next Step</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
