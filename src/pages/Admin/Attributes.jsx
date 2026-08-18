import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import attributeService from '../../services/attributeService';
import subCategoryService from '../../services/subCategoryService';

const DATA_TYPES = ['Text', 'Textarea', 'Number', 'Decimal', 'Boolean', 'Date', 'Color', 'URL', 'Email', 'JSON'];
const INPUT_TYPES = ['Text Field', 'Textarea', 'Dropdown', 'Radio', 'Checkbox', 'Toggle', 'Number Input', 'Color Picker', 'Date Picker', 'Multi Select'];

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editId, setEditId] = useState(null);
  
  // Form fields
  const [subCategoryId, setSubCategoryId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState('Text');
  const [inputType, setInputType] = useState('Text Field');
  
  // Settings
  const [required, setRequired] = useState(false);
  const [searchable, setSearchable] = useState(false);
  const [filterable, setFilterable] = useState(false);
  const [comparable, setComparable] = useState(false);
  const [visibleOnProduct, setVisibleOnProduct] = useState(true);
  const [sellerEditable, setSellerEditable] = useState(true);
  
  // Meta
  const [status, setStatus] = useState('Active');
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [attrRes, subCatRes] = await Promise.all([
        attributeService.getAttributes({ pageSize: 100 }),
        subCategoryService.getSubCategories({ pageSize: 100 })
      ]);
      setAttributes(attrRes.attributes || []);
      setSubCategories(subCatRes.subCategories || []);
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
    setSubCategoryId(item.subCategoryId?._id || item.subCategoryId);
    setName(item.name);
    setCode(item.code);
    setDescription(item.description || '');
    setDataType(item.dataType || 'Text');
    setInputType(item.inputType || 'Text Field');
    
    setRequired(item.required || false);
    setSearchable(item.searchable || false);
    setFilterable(item.filterable || false);
    setComparable(item.comparable || false);
    setVisibleOnProduct(item.visibleOnProduct !== false);
    setSellerEditable(item.sellerEditable !== false);
    
    setStatus(item.status || 'Active');
    setDisplayOrder(item.sortOrder || 0);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setSubCategoryId('');
    setName('');
    setCode('');
    setDescription('');
    setDataType('Text');
    setInputType('Text Field');
    setRequired(false);
    setSearchable(false);
    setFilterable(false);
    setComparable(false);
    setVisibleOnProduct(true);
    setSellerEditable(true);
    setStatus('Active');
    setDisplayOrder(0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !subCategoryId) return;
    
    const payload = {
      subCategoryId,
      name,
      code,
      description,
      dataType,
      inputType,
      required,
      searchable,
      filterable,
      comparable,
      visibleOnProduct,
      sellerEditable,
      status,
      sortOrder: Number(displayOrder)
    };

    try {
      if (editId) {
        await attributeService.updateAttribute(editId, payload);
        toast.success('Attribute updated successfully!');
      } else {
        await attributeService.createAttribute(payload);
        toast.success('Attribute created successfully!');
      }
      handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attribute?')) return;
    try {
      await attributeService.deleteAttribute(id);
      toast.success('Attribute soft deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Attributes Table */}
      <div className="xl:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Attribute Management</h2>
            <p className="text-xs text-gray-500 mt-1">Manage product specifications and dynamic attributes.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-3">Name / Code</th>
                <th className="p-3">Sub Category</th>
                <th className="p-3">Type</th>
                <th className="p-3">Settings</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
              {attributes.map(item => (
                <tr key={item._id} className="hover:bg-gray-50/30">
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.code}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-600">{item.subCategoryId?.name || '-'}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.subCategoryId?.categoryId?.name || ''}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-700">{item.dataType}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{item.inputType}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {item.required && <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px]">Req</span>}
                      {item.filterable && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px]">Filter</span>}
                      {item.searchable && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px]">Search</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] ${item.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{item.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex gap-1">
                      <button onClick={() => handleEditInit(item)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {attributes.length === 0 && !isLoading && <tr><td colSpan="6" className="py-4 text-center text-gray-400">No attributes found.</td></tr>}
              {isLoading && <tr><td colSpan="6" className="py-4 text-center text-gray-400">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <FiSettings className="text-[#ff6a00]" /> {editId ? 'Edit Attribute' : 'Add Attribute'}
          </h3>
          {editId && (
            <button onClick={handleCancelEdit} className="text-xs text-red-500 hover:underline">Cancel</button>
          )}
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Sub Category *</label>
            <select
              required
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium bg-white"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.categoryId?.name})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editId) setCode(e.target.value.toLowerCase().replace(/ /g, '_'));
                }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                placeholder="e.g. Storage"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Code *</label>
              <input
                type="text"
                required
                disabled={!!editId}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs text-gray-600 disabled:bg-gray-50"
                placeholder="e.g. storage"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Data Type</label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white"
              >
                {DATA_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Input Type</label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white"
              >
                {INPUT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Attribute Settings</p>
             <div className="grid grid-cols-2 gap-3">
               <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                 <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="rounded text-[#ff6a00]" />
                 Required
               </label>
               <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                 <input type="checkbox" checked={filterable} onChange={(e) => setFilterable(e.target.checked)} className="rounded text-[#ff6a00]" />
                 Filterable
               </label>
               <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                 <input type="checkbox" checked={searchable} onChange={(e) => setSearchable(e.target.checked)} className="rounded text-[#ff6a00]" />
                 Searchable
               </label>
               <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                 <input type="checkbox" checked={comparable} onChange={(e) => setComparable(e.target.checked)} className="rounded text-[#ff6a00]" />
                 Comparable
               </label>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
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

          <div className="pt-2 border-t border-gray-100">
            <button
              type="submit"
              className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <FiPlus />
              {editId ? 'Update Attribute' : 'Create Attribute'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Attributes;
