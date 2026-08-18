import { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, 
  FiCheckCircle, FiXCircle, FiStar, FiX, FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import categoryService from '../../services/categoryService';
import axios from 'axios';

const ImageDropzone = ({ label, value, onChange, onRemove, isUploading, setIsUploading, accept = "image/*", recommended }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    try {
      setIsUploading(true);
      const res = await axios.post('https://vertex-market-backend.vercel.app/api/v1/upload/cloudinary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center min-h-[140px] max-h-[160px]">
          {value.startsWith('Fi') ? (
            <div className="p-4 flex items-center justify-center">
               <span className="text-2xl text-gray-400 font-mono truncate max-w-[200px]" title={value}>{value}</span>
            </div>
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <label className="cursor-pointer px-4 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Replace Image
              <input type="file" accept={accept} onChange={handleChange} className="hidden" />
            </label>
            <button type="button" onClick={onRemove} className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors min-h-[140px] ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
        >
          <input type="file" accept={accept} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs font-bold text-orange-600">Uploading...</span>
            </div>
          ) : (
            <>
              <FiImage className="text-3xl text-gray-400 mb-2" />
              <span className="text-sm font-bold text-gray-700">Drag & Drop or Click</span>
              <span className="text-[10px] text-gray-500 mt-1">{recommended}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [mobileBanner, setMobileBanner] = useState('');
  const [icon, setIcon] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState('Active');
  const [sortOrder, setSortOrder] = useState(0);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await categoryService.getCategories({ pageSize: 1000 });
      setCategories(res.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditId(null);
    setName('');
    setSlug('');
    setShortDescription('');
    setDescription('');
    setImage('');
    setBannerImage('');
    setMobileBanner('');
    setIcon('');
    setFeatured(false);
    setStatus('Active');
    setSortOrder(0);
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditId(item._id);
    setName(item.name);
    setSlug(item.slug);
    setShortDescription(item.shortDescription || '');
    setDescription(item.description || '');
    setImage(item.image || '');
    setBannerImage(item.bannerImage || '');
    setMobileBanner(item.mobileBanner || '');
    setIcon(item.icon || '');
    setFeatured(item.featured || false);
    setStatus(item.status || 'Active');
    setSortOrder(item.sortOrder || item.displayOrder || 0);
    setSeoTitle(item.seoTitle || '');
    setSeoDescription(item.seoDescription || '');
    setSeoKeywords(item.seoKeywords ? item.seoKeywords.join(', ') : '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Category Card Image is required');
    if (!bannerImage) return toast.error('Category Banner Image is required');
    if (!icon) return toast.error('Category Icon is required');
    
    const payload = {
      name,
      slug,
      shortDescription,
      description,
      image,
      bannerImage,
      mobileBanner,
      icon,
      featured,
      status,
      sortOrder: Number(sortOrder),
      displayOrder: Number(sortOrder),
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords.split(',').map(k => k.trim()).filter(k => k)
    };

    try {
      if (modalMode === 'edit') {
        await categoryService.updateCategory(editId, payload);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.createCategory(payload);
        toast.success('Category created successfully!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const res = await axios.patch(`https://vertex-market-backend.vercel.app/api/v1/categories/${id}/featured`);
      toast.success(res.data.message);
      fetchCategories();
    } catch (error) {
      toast.error('Toggle featured failed');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(`https://vertex-market-backend.vercel.app/api/v1/categories/${id}/status`);
      toast.success(res.data.message);
      fetchCategories();
    } catch (error) {
      toast.error('Toggle status failed');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage all product categories, featured status, and metadata.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-orange-600/20"
        >
          <FiPlus /> Add New Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 border border-gray-100 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search categories by name or slug..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="p-4 w-16">Image</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-center">Products</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Sort Order</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <FiImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 font-mono text-xs text-gray-500">{item.slug}</td>
                    <td className="p-4 text-center font-bold text-gray-700">{item.productCount || 0}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleFeatured(item._id)}
                        className={`inline-flex items-center justify-center p-1.5 rounded-full transition-colors ${item.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Toggle Featured"
                      >
                        <FiStar className={item.featured ? "fill-current" : ""} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(item._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          item.status === 'Active'
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {item.status === 'Active' ? <FiCheckCircle /> : <FiXCircle />}
                        {item.status}
                      </button>
                    </td>
                    <td className="p-4 text-center font-mono text-xs">{item.sortOrder || item.displayOrder || 0}</td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View Category (Coming Soon)">
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                          title="Edit Category"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Category"
                        >
                          <FiTrash2 size={16} />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-4xl w-full my-8">
            <div className="bg-gradient-to-r from-gray-900 to-slate-900 px-6 py-4 flex justify-between items-center text-white rounded-t-3xl">
              <h3 className="font-bold flex items-center gap-2">
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <form id="categoryForm" onSubmit={handleSave} className="space-y-6">
                
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Category Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (modalMode === 'add') setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Slug (Auto Generated)</label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Short Description</label>
                      <input
                        type="text"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Full Description</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Images (Cloudinary) */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span>2. Media & Images</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageDropzone 
                      label="Card Image (600x600) *" 
                      value={image} 
                      onChange={setImage} 
                      onRemove={() => setImage('')} 
                      isUploading={isUploading} 
                      setIsUploading={setIsUploading} 
                      recommended="JPG, PNG, WEBP max 5MB" 
                    />
                    <ImageDropzone 
                      label="Category Banner (1920x600) *" 
                      value={bannerImage} 
                      onChange={setBannerImage} 
                      onRemove={() => setBannerImage('')} 
                      isUploading={isUploading} 
                      setIsUploading={setIsUploading} 
                      recommended="JPG, PNG, WEBP max 5MB" 
                    />
                    <ImageDropzone 
                      label="Mobile Banner (1080x1080)" 
                      value={mobileBanner} 
                      onChange={setMobileBanner} 
                      onRemove={() => setMobileBanner('')} 
                      isUploading={isUploading} 
                      setIsUploading={setIsUploading} 
                      recommended="JPG, PNG, WEBP max 5MB" 
                    />
                    <ImageDropzone 
                      label="Icon (SVG/PNG) *" 
                      value={icon} 
                      onChange={setIcon} 
                      onRemove={() => setIcon('')} 
                      isUploading={isUploading} 
                      setIsUploading={setIsUploading} 
                      accept=".svg,.png,image/png,image/svg+xml"
                      recommended="SVG, PNG max 5MB" 
                    />
                  </div>
                </div>

                {/* Display Settings */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. Display Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Featured</label>
                      <div className="flex items-center h-[42px] px-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded cursor-pointer"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Show on Homepage</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Sort Order</label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. SEO Settings</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">SEO Title</label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">SEO Description</label>
                        <textarea
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none h-[84px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">SEO Keywords (comma separated)</label>
                        <textarea
                          value={seoKeywords}
                          onChange={(e) => setSeoKeywords(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none h-[84px]"
                          placeholder="e.g. mobile, electronics, deals"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold text-sm transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                form="categoryForm"
                type="submit"
                disabled={isUploading}
                className="px-8 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
