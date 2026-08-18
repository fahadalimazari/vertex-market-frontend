import { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiMove, FiCheck, FiX, FiLayers, 
  FiGrid, FiImage, FiCalendar, FiArrowUp, FiArrowDown, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLogs } from '../../context/Admin/LogsContext';
import ImageDropzone from '../../components/common/ImageDropzone';

const FeaturedCategoriesManager = () => {
  const { addLog } = useLogs();
  
  // List of featured categories on homepage
  const [featuredList, setFeaturedList] = useState([]);
  // All available categories in system
  const [allCategories, setAllCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [isUploading, setIsUploading] = useState(false);
  
  // Form fields state
  const [selectedFeaturedId, setSelectedFeaturedId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState('Active');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [featRes, catRes] = await Promise.all([
        axios.get('https://vertex-market-backend.vercel.app/api/home/featured-categories/all'),
        axios.get('https://vertex-market-backend.vercel.app/api/categories')
      ]);

      if (featRes.data && featRes.data.success) {
        setFeaturedList(featRes.data.data);
      }
      if (catRes.data && catRes.data.success) {
        // filter out parent categories or archived if needed, but let's allow all active ones
        setAllCategories(catRes.data.data.filter(c => c.status === 'Active'));
      }
    } catch (err) {
      toast.error('Failed to load catalog category metrics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setCategoryId('');
    setCustomImage('');
    setDisplayOrder(featuredList.length + 1);
    setStatus('Active');
    setStartDate('');
    setEndDate('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedFeaturedId(item._id);
    setCategoryId(item.categoryId?._id || '');
    setCustomImage(item.customImage || '');
    setDisplayOrder(item.displayOrder || 0);
    setStatus(item.status || 'Active');
    setStartDate(item.startDate ? item.startDate.split('T')[0] : '');
    setEndDate(item.endDate ? item.endDate.split('T')[0] : '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error('Please select a category.');
      return;
    }

    try {
      const payload = {
        categoryId,
        customImage: customImage || undefined,
        displayOrder: Number(displayOrder),
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      };

      if (modalMode === 'add') {
        const res = await axios.post('https://vertex-market-backend.vercel.app/api/home/featured-categories', payload);
        if (res.data.success) {
          toast.success('Featured category added successfully.');
          addLog('Featured Category Added', `Added category ID: ${categoryId} to homepage featured list.`);
        }
      } else {
        const res = await axios.put(`https://vertex-market-backend.vercel.app/api/home/featured-categories/${selectedFeaturedId}`, payload);
        if (res.data.success) {
          toast.success('Featured category updated successfully.');
          addLog('Featured Category Updated', `Modified configurations for featured category: ${selectedFeaturedId}`);
        }
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving featured category configurations.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from homepage featured categories?`)) {
      try {
        await axios.delete(`https://vertex-market-backend.vercel.app/api/home/featured-categories/${id}`);
        toast.success('Removed category from homepage.');
        addLog('Featured Category Deleted', `Removed category: "${name}" from homepage featured.`);
        fetchData();
      } catch (err) {
        toast.error('Failed to remove featured category.');
      }
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
      await axios.patch('https://vertex-market-backend.vercel.app/api/home/featured-categories/status', {
        id: item._id,
        status: newStatus
      });
      toast.success(`Category set to ${newStatus}.`);
      addLog('Featured Category Status Toggled', `Toggled homepage category "${item.categoryId?.name}" status to "${newStatus}".`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const moveOrder = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === featuredList.length - 1) return;

    const listCopy = [...featuredList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIdx];
    listCopy[targetIdx] = temp;

    // Map new displayOrders
    const updatedOrders = listCopy.map((item, idx) => ({
      id: item._id,
      displayOrder: idx + 1
    }));

    try {
      await axios.patch('https://vertex-market-backend.vercel.app/api/home/featured-categories/reorder', { orders: updatedOrders });
      toast.success('Display order updated.');
      fetchData();
    } catch (err) {
      toast.error('Failed to save display order updates.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiLayers className="text-[#ff6a00]" /> Homepage Featured Categories
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure which active categories appear on the homepage grid and override banners.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-orange-600/20"
        >
          <FiPlus /> Add Featured Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      ) : featuredList.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <FiGrid className="mx-auto text-5xl text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-gray-800">No Featured Categories Defined</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            There are no categories configured to show on the homepage. Click the button above to feature your first catalog category.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4 w-12 text-center">Order</th>
                  <th className="p-4">Category Detail</th>
                  <th className="p-4">Schedule Dates</th>
                  <th className="p-4 w-28">Status</th>
                  <th className="p-4 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {featuredList.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Display Order Controls */}
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => moveOrder(index, 'up')}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                        >
                          <FiArrowUp size={14} />
                        </button>
                        <span className="font-mono font-bold text-xs bg-gray-100 px-2 py-0.5 rounded-md">
                          {item.displayOrder}
                        </span>
                        <button
                          disabled={index === featuredList.length - 1}
                          onClick={() => moveOrder(index, 'down')}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${index === featuredList.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                        >
                          <FiArrowDown size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Category Detail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.customImage || item.categoryId?.image || 'https://via.placeholder.com/150'} 
                          alt={item.categoryId?.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0" 
                        />
                        <div>
                          <span className="font-bold text-gray-900 block leading-snug">
                            {item.categoryId?.name || <span className="text-red-500 line-through">Deleted Category</span>}
                          </span>
                          <span className="text-xs text-gray-500 font-mono block mt-0.5">
                            slug: {item.categoryId?.slug || 'n/a'}
                          </span>
                          {item.customImage && (
                            <span className="inline-block mt-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              Custom Image Active
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Schedule Dates */}
                    <td className="p-4">
                      {item.startDate || item.endDate ? (
                        <div className="text-xs space-y-1 text-gray-600 font-medium">
                          {item.startDate && (
                            <div className="flex items-center gap-1">
                              <FiCalendar className="text-gray-400 shrink-0" />
                              <span>Start: {new Date(item.startDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {item.endDate && (
                            <div className="flex items-center gap-1">
                              <FiCalendar className="text-orange-400 shrink-0" />
                              <span>End: {new Date(item.endDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">Always Displayed</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
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

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                          title="Edit Configuration"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.categoryId?.name)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Remove Feature"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <FiGrid className="text-orange-400" />
                {modalMode === 'add' ? 'Feature New Category' : 'Edit Featured Category'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Category
                </label>
                <select
                  disabled={modalMode === 'edit'}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">-- Choose Category --</option>
                  {allCategories.map(c => {
                    // Check if already featured in add mode
                    const isFeatured = modalMode === 'add' && featuredList.some(f => f.categoryId?._id === c._id);
                    return (
                      <option key={c._id} value={c._id} disabled={isFeatured}>
                        {c.name} {isFeatured ? '(Already Featured)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Custom Image override */}
              <div>
                <ImageDropzone 
                  label="Custom Banner / Display Image URL (Optional)" 
                  value={customImage} 
                  onChange={setCustomImage} 
                  onRemove={() => setCustomImage('')} 
                  isUploading={isUploading} 
                  setIsUploading={setIsUploading} 
                  recommended="JPG, PNG, WEBP max 5MB" 
                />
              </div>

              {/* Order and Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-bold text-sm transition-colors text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedCategoriesManager;
