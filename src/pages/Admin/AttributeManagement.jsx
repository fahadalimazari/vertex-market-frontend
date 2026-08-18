import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AttributeManagement = () => {
  const [attributes, setAttributes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, subCategoryId: '', name: '', code: '', inputType: 'Text Field', required: false, status: 'Active' });

  const fetchAttributes = async () => {
    try {
      const res = await axios.get('https://vertex-market-backend.vercel.app/api/attributes');
      setAttributes(res.data.attributes || []);
    } catch (error) {
      toast.error('Failed to load attributes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get('https://vertex-market-backend.vercel.app/api/subcategories');
      setSubCategories(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttributes();
    fetchSubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`https://vertex-market-backend.vercel.app/api/attributes/${formData.id}`, formData);
        toast.success('Attribute updated');
      } else {
        await axios.post('https://vertex-market-backend.vercel.app/api/attributes', formData);
        toast.success('Attribute created');
      }
      setIsModalOpen(false);
      fetchAttributes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving attribute');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        await axios.delete(`https://vertex-market-backend.vercel.app/api/attributes/${id}`);
        toast.success('Attribute deleted');
        fetchAttributes();
      } catch (error) {
        toast.error('Error deleting attribute');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Attribute Management</h2>
          <p className="text-sm text-gray-500">Manage dynamic attributes for subcategories</p>
        </div>
        <button
          onClick={() => { setFormData({ id: null, subCategoryId: '', name: '', code: '', inputType: 'Text Field', required: false, status: 'Active' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-orange-700 transition"
        >
          <FiPlus /> Add Attribute
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Code</th>
              <th className="py-4 px-6">Sub Category</th>
              <th className="py-4 px-6">Input Type</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : attributes.map(attr => (
              <tr key={attr._id} className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium text-gray-900">
                  {attr.name}
                  {attr.required && <span className="ml-2 text-red-500 text-xs">*</span>}
                </td>
                <td className="py-4 px-6 text-gray-500">{attr.code}</td>
                <td className="py-4 px-6 text-gray-500">{attr.subCategoryId?.name || '-'}</td>
                <td className="py-4 px-6 text-gray-500">{attr.inputType}</td>
                <td className="py-4 px-6 flex justify-end gap-2">
                  <button onClick={() => { setFormData({ id: attr._id, ...attr, subCategoryId: attr.subCategoryId?._id }); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(attr._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.id ? 'Edit' : 'Add'} Attribute</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Code *</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-2 border rounded-xl" disabled={!!formData.id} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Sub Category *</label>
                <select required value={formData.subCategoryId} onChange={e => setFormData({ ...formData, subCategoryId: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                  <option value="">Select Sub Category</option>
                  {subCategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Input Type</label>
                  <select value={formData.inputType} onChange={e => setFormData({ ...formData, inputType: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                    <option value="Text Field">Text Field</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Checkbox">Checkbox</option>
                    <option value="Radio">Radio</option>
                  </select>
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                    <input type="checkbox" checked={formData.required} onChange={e => setFormData({ ...formData, required: e.target.checked })} className="w-4 h-4 text-orange-600 rounded" />
                    Required Field
                  </label>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold">Save Attribute</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeManagement;
