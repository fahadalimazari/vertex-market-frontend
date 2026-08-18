import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import subCategoryService from '../../services/subCategoryService';
import categoryService from '../../services/categoryService';

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editId, setEditId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [icon, setIcon] = useState('');
  const [status, setStatus] = useState('Active');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [subCatRes, catRes] = await Promise.all([
        subCategoryService.getSubCategories({ pageSize: 100 }),
        categoryService.getCategories({ pageSize: 100 })
      ]);
      setSubCategories(subCatRes.subCategories || []);
      setCategories(catRes.categories || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditInit = (item) => {
    setEditId(item._id);
    setCategoryId(item.categoryId?._id || item.categoryId);
    setName(item.name);
    setSlug(item.slug);
    setDescription(item.description || '');
    setImage(item.image || '');
    setIcon(item.icon || '');
    setStatus(item.status || 'Active');
    setDisplayOrder(item.displayOrder || 0);
    setIsFeatured(item.isFeatured || false);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setCategoryId('');
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setIcon('');
    setStatus('Active');
    setDisplayOrder(0);
    setIsFeatured(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !categoryId) return;
    
    const payload = {
      categoryId,
      name,
      slug,
      description,
      image,
      icon,
      status,
      displayOrder: Number(displayOrder),
      isFeatured
    };

    try {
      if (editId) {
        await subCategoryService.updateSubCategory(editId, payload);
        toast.success('Sub Category updated successfully!');
      } else {
        await subCategoryService.createSubCategory(payload);
        toast.success('Sub Category created successfully!');
      }
      handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sub category?')) return;
    try {
      await subCategoryService.deleteSubCategory(id);
      toast.success('Sub Category soft deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sub Categories Table */}
      <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Sub Category Management</h2>
            <p className="text-xs text-gray-500 mt-1">Manage subcategories associated with parent categories.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Parent Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Order</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
              {subCategories.map(item => (
                <tr key={item._id} className="hover:bg-gray-50/30">
                  <td className="p-3">
                    <div className="h-8 w-8 bg-gray-50 border border-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="object-cover" /> : <FiImage className="text-gray-400" />}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-gray-900">{item.name}</td>
                  <td className="p-3 text-gray-600">{item.categoryId?.name || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] ${item.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{item.status}</span>
                  </td>
                  <td className="p-3 text-gray-600">{item.displayOrder}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] ${item.isFeatured ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{item.isFeatured ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex gap-1">
                      <button onClick={() => handleEditInit(item)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {subCategories.length === 0 && !isLoading && <tr><td colSpan="8" className="py-4 text-center text-gray-400">No sub categories found.</td></tr>}
              {isLoading && <tr><td colSpan="8" className="py-4 text-center text-gray-400">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <FiPlus className="text-[#ff6a00]" /> {editId ? 'Edit Sub Category' : 'Add Sub Category'}
          </h3>
          {editId && (
            <button onClick={handleCancelEdit} className="text-xs text-red-500 hover:underline">Cancel</button>
          )}
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Parent Category *</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium bg-white"
            >
              <option value="">Select Parent Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Sub Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editId) setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
              }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
              placeholder="e.g. Mobile Phones"
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Slug URL *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs text-gray-600 bg-gray-50"
              placeholder="e.g. mobile-phones"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
          </div>

          <div>
             <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
               <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
               Featured Sub Category
             </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <FiPlus />
              {editId ? 'Update Sub Category' : 'Create Sub Category'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SubCategories;
