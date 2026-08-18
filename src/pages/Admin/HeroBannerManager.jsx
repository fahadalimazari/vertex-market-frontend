import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiCopy, FiCheckCircle,
  FiXCircle, FiCalendar, FiArrowUp, FiArrowDown, FiSearch,
  FiX, FiImage, FiLink, FiLayers, FiShield, FiTrendingUp, FiSettings,
  FiUpload, FiFolder, FiFilter, FiMaximize2, FiGrid, FiCheck
} from 'react-icons/fi';

const HeroBannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  // Media Library Modal & Upload state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('All');
  const [selectedMediaPreview, setSelectedMediaPreview] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    badge: 'VERTEX PRO',
    description: '',
    primaryButtonText: 'Shop Now',
    primaryButtonUrl: '/products',
    secondaryButtonText: 'Explore Deals',
    secondaryButtonUrl: '/products?filter=flash-sale',
    desktopImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
    mobileImage: '',
    tabletImage: '',
    displayOrder: 1,
    status: 'Active',
    featured: true,
    autoRotate: true,
    openInNewTab: false,
    startDate: '',
    endDate: '',
    altText: '',
    imageTitle: ''
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/hero-banners?admin=true');
      if (response.data && response.data.success) {
        setBanners(response.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load hero banners from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        name: banner.name || '',
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        badge: banner.badge || '',
        description: banner.description || '',
        primaryButtonText: banner.primaryButtonText || 'Shop Now',
        primaryButtonUrl: banner.primaryButtonUrl || '/products',
        secondaryButtonText: banner.secondaryButtonText || 'Explore Deals',
        secondaryButtonUrl: banner.secondaryButtonUrl || '/products?filter=flash-sale',
        desktopImage: banner.desktopImage || '',
        mobileImage: banner.mobileImage || '',
        tabletImage: banner.tabletImage || '',
        displayOrder: banner.displayOrder || 1,
        status: banner.status || 'Active',
        featured: Boolean(banner.featured),
        autoRotate: banner.autoRotate !== undefined ? Boolean(banner.autoRotate) : true,
        openInNewTab: Boolean(banner.openInNewTab),
        startDate: banner.startDate ? banner.startDate.slice(0, 10) : '',
        endDate: banner.endDate ? banner.endDate.slice(0, 10) : '',
        altText: banner.altText || '',
        imageTitle: banner.imageTitle || ''
      });
    } else {
      setEditingBanner(null);
      const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.displayOrder || 0)) + 1 : 1;
      setFormData({
        name: '',
        title: '',
        subtitle: '',
        badge: 'VERTEX PRO',
        description: '',
        primaryButtonText: 'Shop Now',
        primaryButtonUrl: '/products',
        secondaryButtonText: 'Explore Deals',
        secondaryButtonUrl: '/products?filter=flash-sale',
        desktopImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
        mobileImage: '',
        tabletImage: '',
        displayOrder: nextOrder,
        status: 'Active',
        featured: false,
        autoRotate: true,
        openInNewTab: false,
        startDate: '',
        endDate: '',
        altText: '',
        imageTitle: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.desktopImage) {
      toast.error('Title and Desktop Image are required!');
      return;
    }

    try {
      const payload = { ...formData };
      if (!payload.startDate) payload.startDate = null;
      if (!payload.endDate) payload.endDate = null;

      if (editingBanner) {
        await axios.put(`http://localhost:5000/api/v1/hero-banners/${editingBanner._id}`, payload);
        toast.success('Hero banner updated successfully! ✨');
      } else {
        await axios.post('http://localhost:5000/api/v1/hero-banners', payload);
        toast.success('New Hero banner created successfully! 🎉');
      }
      handleCloseModal();
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save hero banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this hero banner?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/hero-banners/${id}`);
      toast.success('Hero banner removed');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.patch(`http://localhost:5000/api/v1/hero-banners/${id}/status`, { status: newStatus });
      toast.success(`Banner status changed to ${newStatus}`);
      fetchBanners();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDuplicate = async (banner) => {
    try {
      const copyData = { ...banner };
      delete copyData._id;
      delete copyData.createdAt;
      delete copyData.updatedAt;
      delete copyData.__v;
      copyData.name = `${copyData.name || copyData.title} (Copy)`;
      copyData.title = `${copyData.title} (Copy)`;
      copyData.displayOrder = banners.length + 1;

      await axios.post('http://localhost:5000/api/v1/hero-banners', copyData);
      toast.success('Banner duplicated successfully! 📋');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to duplicate banner');
    }
  };

  const handleReorder = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === banners.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = banners[index];
    const target = banners[targetIndex];

    const currentOrder = current.displayOrder || index + 1;
    const targetOrder = target.displayOrder || targetIndex + 1;

    try {
      await axios.patch('http://localhost:5000/api/v1/hero-banners/reorder', {
        items: [
          { id: current._id, displayOrder: targetOrder },
          { id: target._id, displayOrder: currentOrder }
        ]
      });
      toast.success('Banner reordered ↕️');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to reorder banners');
    }
  };

  // --- Media Library & File Upload Functions ---
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('image', file);

    try {
      setUploadingField(fieldName || 'media-library');
      const res = await axios.post('http://localhost:5000/api/v1/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.success && res.data.url) {
        const fullUrl = res.data.url.startsWith('http') ? res.data.url : `http://localhost:5000${res.data.url}`;
        if (fieldName) {
          setFormData(prev => ({ ...prev, [fieldName]: fullUrl }));
          toast.success('Image uploaded and applied! 📸');
        } else {
          toast.success('File uploaded to Media Library! 📂');
          fetchMediaItems(); // Refresh library if open
        }
      }
    } catch (err) {
      toast.error('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingField(null);
    }
  };

  const fetchMediaItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/upload');
      if (res.data && res.data.success) {
        setMediaItems(res.data.media || res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load Media Library from server');
    }
  };

  const handleOpenMediaLibrary = async (fieldName) => {
    setCurrentMediaField(fieldName);
    setIsMediaModalOpen(true);
    await fetchMediaItems();
  };

  const handleSelectMediaItem = (item) => {
    if (currentMediaField) {
      const targetUrl = item.url || item.relativePath;
      setFormData(prev => ({ ...prev, [currentMediaField]: targetUrl }));
      toast.success('Image selected from Media Library! ✨');
    }
    setIsMediaModalOpen(false);
    setCurrentMediaField(null);
  };

  const filteredBanners = banners.filter(b => 
    (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.badge || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(mediaSearch.toLowerCase()) ||
                          (item.category || '').toLowerCase().includes(mediaSearch.toLowerCase());
    const matchesCategory = mediaCategoryFilter === 'All' || item.category === mediaCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoriesList = ['All', 'Uploaded Files', 'Computers & Laptops', 'Electronics & Audio', 'Gaming', 'Mobiles & Tablets'];

  const renderMediaInputBox = (label, fieldName, isRequired, helperText) => (
    <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
            {label} {isRequired && '<span className="text-red-500">*</span>'}
          </label>
          <p className="text-[11px] text-gray-500 mt-0.5">{helperText}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Upload New Image Button */}
          <label className="cursor-pointer px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 active:scale-95">
            <FiUpload className="text-orange-600 text-sm" />
            {uploadingField === fieldName ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingField === fieldName}
              onChange={(e) => handleFileUpload(e, fieldName)}
            />
          </label>

          {/* Select Existing Image Button */}
          <button
            type="button"
            onClick={() => handleOpenMediaLibrary(fieldName)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <FiFolder className="text-sm" /> Select Image
          </button>
        </div>
      </div>
      
      {/* Direct URL input fallback */}
      <div className="relative">
        <input
          type="url"
          name={fieldName}
          placeholder="Or paste image URL (https://... or /uploads/...)"
          value={formData[fieldName]}
          onChange={handleChange}
          required={isRequired}
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-700 focus:outline-none focus:border-orange-500 shadow-inner"
        />
      </div>

      {/* Image Preview Area */}
      <div className="w-full h-44 rounded-xl bg-gray-900 border border-gray-300 overflow-hidden relative flex items-center justify-center shadow-inner group/box">
        {formData[fieldName] ? (
          <>
            <img src={formData[fieldName]} alt={label} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/box:scale-105" />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-mono border border-white/20">
              Active Image Preview
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, [fieldName]: '' }))}
              className="absolute top-2 right-2 p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-full opacity-0 group-hover/box:opacity-100 transition-all transform scale-90 group-hover/box:scale-100 shadow-lg"
              title="Remove Image"
            >
              <FiX size={16} />
            </button>
          </>
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="p-3 bg-white/5 rounded-full border border-white/10">
              <FiImage size={24} className="text-gray-500" />
            </div>
            <span className="text-xs font-medium max-w-sm">
              No image assigned. Click <strong>Upload Image</strong> or <strong>Select Image</strong> above to attach media from storage.
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl md:rounded-3xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FiLayers /> Content Management Module
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Hero Banner Management</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            Control homepage hero slides, flash sale schedules, CTA destinations, and promotional campaigns dynamically without touching frontend code.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30 shrink-0 w-fit active:scale-95"
        >
          <FiPlus className="text-lg" /> Add New Hero Banner
        </button>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by banner name, title, or badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
          <span>Total Banners: <strong className="text-gray-900">{banners.length}</strong></span>
          <span>•</span>
          <span>Active: <strong className="text-green-600">{banners.filter(b => b.status === 'Active').length}</strong></span>
        </div>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 text-xs uppercase font-extrabold tracking-wider">
                <th className="py-4 px-4 md:px-6">Order</th>
                <th className="py-4 px-4 md:px-6">Media Preview</th>
                <th className="py-4 px-4 md:px-6">Banner Title & Badge</th>
                <th className="py-4 px-6 hidden lg:table-cell">Primary / Secondary CTAs</th>
                <th className="py-4 px-6 hidden md:table-cell">Schedule & Status</th>
                <th className="py-4 px-6 hidden xl:table-cell">Created & Updated</th>
                <th className="py-4 px-4 md:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-bold">
                    Loading Enterprise Hero Banners...
                  </td>
                </tr>
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                    No hero banners found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner, idx) => (
                  <tr key={banner._id} className="hover:bg-gray-50/60 transition-colors group">
                    {/* Display Order & Reorder arrows */}
                    <td className="py-4 px-4 md:px-6 font-black text-gray-900 w-16 md:w-24">
                      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                        <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs">
                          {banner.displayOrder || idx + 1}
                        </span>
                        <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleReorder(idx, 'up')}
                            className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Up"
                          >
                            <FiArrowUp size={12} />
                          </button>
                          <button
                            disabled={idx === filteredBanners.length - 1}
                            onClick={() => handleReorder(idx, 'down')}
                            className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Down"
                          >
                            <FiArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Media Preview Thumbnail */}
                    <td className="py-4 px-4 md:px-6">
                      <div 
                        onClick={() => setPreviewBanner(banner)}
                        className="w-16 h-10 md:w-28 md:h-16 rounded-lg md:rounded-xl overflow-hidden bg-gray-900 relative group/thumb cursor-pointer shadow-sm border border-gray-200"
                        title="Click to live preview slide"
                      >
                        <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <FiEye /> Preview
                        </div>
                      </div>
                    </td>

                    {/* Title & Badge */}
                    <td className="py-4 px-4 md:px-6 max-w-[140px] md:max-w-xs">
                      <div className="space-y-1">
                        {banner.badge && (
                          <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md font-extrabold text-[10px] tracking-wider uppercase">
                            {banner.badge}
                          </span>
                        )}
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{banner.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{banner.subtitle || banner.description || 'No subtitle provided.'}</p>
                        <span className="text-[11px] text-gray-400 block font-mono">ID Name: {banner.name || banner.title}</span>
                      </div>
                    </td>

                    {/* Button CTAs */}
                    <td className="py-4 px-6 text-xs space-y-2 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        {banner.primaryButtonText || 'Shop Now'} &rarr; <span className="text-gray-400 font-normal underline">{banner.primaryButtonUrl}</span>
                      </div>
                      {banner.secondaryButtonText && (
                        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          {banner.secondaryButtonText} &rarr; <span className="text-gray-400 font-normal underline">{banner.secondaryButtonUrl}</span>
                        </div>
                      )}
                    </td>

                    {/* Schedule & Status Toggle */}
                    <td className="py-4 px-6 hidden md:table-cell">
                      <div className="flex flex-col items-start gap-2">
                        <button
                          onClick={() => handleToggleStatus(banner._id, banner.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-xs transition-colors cursor-pointer ${
                            banner.status === 'Active'
                              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {banner.status === 'Active' ? <FiCheckCircle /> : <FiXCircle />}
                          {banner.status || 'Active'}
                        </button>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <FiCalendar className="text-gray-400 shrink-0" />
                          {banner.startDate || banner.endDate ? (
                            <span>
                              {banner.startDate ? banner.startDate.slice(0, 10) : 'Now'} — {banner.endDate ? banner.endDate.slice(0, 10) : 'No Exp'}
                            </span>
                          ) : (
                            <span className="text-gray-400">Always Active</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Created By & Timestamps */}
                    <td className="py-4 px-6 text-xs text-gray-500 space-y-1 hidden xl:table-cell">
                      <div>By: <strong className="text-gray-800">{banner.createdBy || 'Admin'}</strong></div>
                      <div className="text-[11px] text-gray-400">Created: {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-[11px] text-gray-400">Updated: {banner.updatedAt ? new Date(banner.updatedAt).toLocaleDateString() : 'N/A'}</div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 md:px-6 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1 md:gap-2">
                        <button
                          onClick={() => setPreviewBanner(banner)}
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                          title="Preview Slide"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleDuplicate(banner)}
                          className="p-2 hover:bg-gray-100 text-blue-600 rounded-lg transition-colors"
                          title="Duplicate Banner"
                        >
                          <FiCopy />
                        </button>
                        <button
                          onClick={() => handleOpenModal(banner)}
                          className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
                          title="Edit Banner"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete Banner"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Preview Modal (100% Identical to Homepage Hero slide) */}
      <AnimatePresence>
        {previewBanner && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full border border-gray-800"
            >
              <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
                <span className="px-3 py-1 bg-black/60 text-white rounded-full text-xs font-mono backdrop-blur-md">
                  Live Homepage Preview
                </span>
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Exact Homepage Slider Container */}
              <div className="relative min-h-[480px] w-full flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent z-10"></div>
                <img src={previewBanner.desktopImage} alt={previewBanner.title} className="absolute inset-0 w-full h-full object-cover object-center" />

                <div className="relative z-20 p-10 md:p-16 w-full md:w-3/4 text-left">
                  {previewBanner.badge && (
                    <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-orange-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6 w-fit border border-orange-500/30">
                      {previewBanner.badge}
                    </span>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-6">
                    {previewBanner.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-10 max-w-md leading-relaxed">
                    {previewBanner.subtitle || previewBanner.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold shadow-sm">
                      {previewBanner.primaryButtonText || 'Shop Now'} &rarr;
                    </div>
                    {previewBanner.secondaryButtonText && (
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg font-bold shadow-sm">
                        {previewBanner.secondaryButtonText}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-950 p-4 border-t border-gray-800 text-gray-400 text-xs flex flex-wrap items-center justify-between gap-4">
                <div>Primary Target URL: <span className="text-orange-400 font-mono">{previewBanner.primaryButtonUrl}</span></div>
                <div>Secondary Target URL: <span className="text-gray-300 font-mono">{previewBanner.secondaryButtonUrl || 'None'}</span></div>
                <div>Status: <span className="text-green-400 font-bold">{previewBanner.status}</span></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Hero Banner Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100 my-8"
            >
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {editingBanner ? 'Edit Hero Banner' : 'Add New Hero Banner'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Fill in general information, CTA buttons, media library images, and campaign schedules.</p>
                </div>
                <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-700 rounded-full transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: General Information */}
                <div>
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiLayers className="text-orange-500" /> General Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Banner Name (Internal Reference) *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Summer Mega Sale 2026 Deal"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Badge / Brand Pill Text</label>
                      <input
                        type="text"
                        name="badge"
                        placeholder="e.g., VERTEX PRO / FLASH SALE"
                        value={formData.badge}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Main Headline Title *</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="e.g., Next-Gen Computing"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Supporting Text</label>
                      <textarea
                        name="subtitle"
                        rows={2}
                        placeholder="Up to 30% Off on Laptops. Experience the power of the latest processors."
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Buttons Configuration */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiLink className="text-blue-500" /> Action Buttons (CTAs)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-3">
                      <h4 className="text-xs font-black text-orange-700">Primary Button (Orange CTA)</h4>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Text</label>
                        <input
                          type="text"
                          name="primaryButtonText"
                          placeholder="Shop Now"
                          value={formData.primaryButtonText}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Destination URL / Route</label>
                        <input
                          type="text"
                          name="primaryButtonUrl"
                          placeholder="/products or https://..."
                          value={formData.primaryButtonUrl}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                      <h4 className="text-xs font-black text-gray-700">Secondary Button (Translucent CTA)</h4>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Text</label>
                        <input
                          type="text"
                          name="secondaryButtonText"
                          placeholder="Explore Deals"
                          value={formData.secondaryButtonText}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Destination URL / Route</label>
                        <input
                          type="text"
                          name="secondaryButtonUrl"
                          placeholder="/products?filter=flash-sale"
                          value={formData.secondaryButtonUrl}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Media (Upload OR Select from Media Library) */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiImage className="text-green-500" /> Media Variants (Upload New or Select Existing)
                  </h3>
                  <div className="space-y-6">
                    {renderMediaInputBox('Desktop Image', 'desktopImage', true, 'Primary hero slider resolution (Recommended: 1920x800 or higher)')}
                    {renderMediaInputBox('Mobile Image', 'mobileImage', false, 'Optional viewport fallback for mobile screens (Recommended: 768x900)')}
                    {renderMediaInputBox('Tablet Image', 'tabletImage', false, 'Optional viewport fallback for iPad & tablet screens (Recommended: 1024x800)')}
                  </div>
                </div>

                {/* Section 4: Settings & Scheduling */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiSettings className="text-purple-500" /> Settings & Campaign Schedule
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        name="displayOrder"
                        value={formData.displayOrder}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Publication Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Start Date (Optional)</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">End Date / Expiry (Optional)</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-200/60">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                      <input
                        type="checkbox"
                        name="autoRotate"
                        checked={formData.autoRotate}
                        onChange={handleChange}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      Enable Autoplay Rotation
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      Mark as Featured Banner
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                      <input
                        type="checkbox"
                        name="openInNewTab"
                        checked={formData.openInNewTab}
                        onChange={handleChange}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      Open Destination URL in New Tab
                    </label>
                  </div>
                </div>

                {/* Section 5: SEO & Accessibility */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-indigo-500" /> SEO & Accessibility (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text (Screen Readers & SEO)</label>
                      <input
                        type="text"
                        name="altText"
                        placeholder="e.g., Vertex Market discount laptops banner"
                        value={formData.altText}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Image Title Attribute</label>
                      <input
                        type="text"
                        name="imageTitle"
                        placeholder="e.g., Special Computing Offer"
                        value={formData.imageTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit / Cancel Footer */}
                <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-lg shadow-orange-600/30 transition-all active:scale-95"
                  >
                    {editingBanner ? 'Save Changes' : 'Create Hero Banner'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Library / File Manager Modal */}
      <AnimatePresence>
        {isMediaModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col h-[85vh] overflow-hidden border border-gray-100 my-4"
            >
              {/* Modal Top Header */}
              <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/30 text-orange-400">
                    <FiGrid className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Centralized Media Library & File Manager</h3>
                    <p className="text-xs text-gray-300">Browse, search, filter, preview, or select previously uploaded assets without re-uploading duplicate files.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-lg active:scale-95">
                    <FiUpload /> Upload New File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, null)}
                    />
                  </label>
                  <button
                    onClick={() => setIsMediaModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                <div className="relative w-full md:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search image filename or title..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <span className="text-xs font-bold text-gray-500 shrink-0 mr-1 flex items-center gap-1">
                    <FiFilter /> Filter:
                  </span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMediaCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
                        mediaCategoryFilter === cat
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100/60">
                {filteredMedia.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <FiFolder className="text-5xl text-gray-300" />
                    <p className="font-bold text-sm">No media files match your current search and filter criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {filteredMedia.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                      >
                        <div className="h-36 bg-gray-900 relative overflow-hidden flex items-center justify-center">
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>
                          <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                            {item.dimensions || 'Image Asset'}
                          </div>

                          {/* Hover Actions Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <button
                              type="button"
                              onClick={() => setSelectedMediaPreview(item)}
                              className="p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-xl transition-colors"
                              title="Full Screen Preview"
                            >
                              <FiMaximize2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectMediaItem(item)}
                              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-transform transform active:scale-90 flex items-center gap-1 shadow-lg"
                              title="Select & Apply Image"
                            >
                              <FiCheck /> Select
                            </button>
                          </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-gray-800 text-xs truncate" title={item.name}>{item.name}</h4>
                            <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block mt-0.5">{item.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-2">
                            <span>{item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : 'Media Asset'}</span>
                            <span>{item.date ? new Date(item.date).toLocaleDateString() : 'Active'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-gray-500 font-medium">
                  Showing <strong>{filteredMedia.length}</strong> of <strong>{mediaItems.length}</strong> total library assets.
                </span>
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Close Library
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enlarged Media Preview Modal */}
      <AnimatePresence>
        {selectedMediaPreview && (
          <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-3xl max-w-4xl w-full overflow-hidden border border-gray-800 shadow-2xl relative flex flex-col"
            >
              <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <FiEye className="text-orange-500" />
                  <span className="text-sm font-bold truncate">{selectedMediaPreview.name}</span>
                </div>
                <button
                  onClick={() => setSelectedMediaPreview(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="max-h-[70vh] flex items-center justify-center bg-black p-4 overflow-hidden">
                <img src={selectedMediaPreview.url} alt={selectedMediaPreview.name} className="max-w-full max-h-[65vh] object-contain rounded-lg" />
              </div>
              <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <div className="space-x-4">
                  <span>Category: <strong className="text-orange-400">{selectedMediaPreview.category}</strong></span>
                  <span>Dimensions: <strong className="text-white">{selectedMediaPreview.dimensions}</strong></span>
                  <span>URL: <span className="text-gray-300 font-mono select-all">{selectedMediaPreview.url}</span></span>
                </div>
                <button
                  onClick={() => {
                    handleSelectMediaItem(selectedMediaPreview);
                    setSelectedMediaPreview(null);
                  }}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  <FiCheck /> Apply This Image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroBannerManager;
