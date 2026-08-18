import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import attributeValueService from '../../services/attributeValueService';
import attributeService from '../../services/attributeService';

const AttributeValues = () => {
  const [values, setValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editId, setEditId] = useState(null);
  
  // Form fields
  const [attributeId, setAttributeId] = useState('');
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [colorCode, setColorCode] = useState('');
  
  // Settings
  const [isDefault, setIsDefault] = useState(false);
  
  // Meta
  const [status, setStatus] = useState('Active');
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [valRes, attrRes] = await Promise.all([
        attributeValueService.getAttributeValues({ pageSize: 100 }),
        attributeService.getAttributes({ pageSize: 100 })
      ]);
      setValues(valRes.attributeValues || []);
      // Filter out attributes that don't need predefined values, or just show all for now
      setAttributes(attrRes.attributes || []);
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
    setAttributeId(item.attributeId?._id || item.attributeId);
    setValue(item.value);
    setLabel(item.label);
    setColorCode(item.colorCode || '');
    
    setIsDefault(item.isDefault || false);
    
    setStatus(item.status || 'Active');
    setDisplayOrder(item.sortOrder || 0);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setAttributeId('');
    setValue('');
    setLabel('');
    setColorCode('');
    setIsDefault(false);
    setStatus('Active');
    setDisplayOrder(0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!value.trim() || !label.trim() || !attributeId) return;
    
    const payload = {
      attributeId,
      value,
      label,
      colorCode,
      isDefault,
      status,
      sortOrder: Number(displayOrder)
    };

    try {
      if (editId) {
        await attributeValueService.updateAttributeValue(editId, payload);
        toast.success('Value updated successfully!');
      } else {
        await attributeValueService.createAttributeValue(payload);
        toast.success('Value created successfully!');
      }
      handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this value?')) return;
    try {
      await attributeValueService.deleteAttributeValue(id);
      toast.success('Value soft deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Values Table */}
      <div className="xl:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Attribute Values</h2>
            <p className="text-xs text-gray-500 mt-1">Manage predefined choices (e.g. Red, Blue, 128GB).</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-3">Label / Value</th>
                <th className="p-3">Attribute</th>
                <th className="p-3">Settings</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-750">
              {values.map(item => (
                <tr key={item._id} className="hover:bg-gray-50/30">
                  <td className="p-3">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {item.colorCode && <div className="w-3 h-3 rounded-full border border-gray-200" style={{backgroundColor: item.colorCode}}></div>}
                      {item.label}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.value}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-600">{item.attributeId?.name || '-'}</div>
                  </td>
                  <td className="p-3">
                    {item.isDefault && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px]">Default</span>}
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
              {values.length === 0 && !isLoading && <tr><td colSpan="5" className="py-4 text-center text-gray-400">No values found.</td></tr>}
              {isLoading && <tr><td colSpan="5" className="py-4 text-center text-gray-400">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <FiSettings className="text-[#ff6a00]" /> {editId ? 'Edit Value' : 'Add Value'}
          </h3>
          {editId && (
            <button onClick={handleCancelEdit} className="text-xs text-red-500 hover:underline">Cancel</button>
          )}
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Attribute *</label>
            <select
              required
              value={attributeId}
              onChange={(e) => setAttributeId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium bg-white"
            >
              <option value="">Select Attribute</option>
              {attributes.map(a => (
                <option key={a._id} value={a._id}>{a.name} ({a.subCategoryId?.name})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Label *</label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  if (!editId && !value) setValue(e.target.value);
                }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                placeholder="e.g. Jet Black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Value *</label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                placeholder="e.g. black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Color Code (Optional)</label>
            <input
              type="text"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
              placeholder="#000000"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
             <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
               <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded text-[#ff6a00]" />
               Set as Default Value
             </label>
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
              {editId ? 'Update Value' : 'Create Value'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AttributeValues;
