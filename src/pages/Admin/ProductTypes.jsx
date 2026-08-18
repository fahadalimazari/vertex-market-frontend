import { useState } from 'react';
import { FiPlus, FiTag, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialProductTypes = [
  { id: 'pt-1', name: 'Mobile', category: 'cat-2', defaultGroups: ['General', 'Specifications', 'Battery', 'Dimensions'], status: 'Active' },
  { id: 'pt-2', name: 'Laptop', category: 'cat-2', defaultGroups: ['General', 'Performance', 'Display', 'Ports'], status: 'Active' },
  { id: 'pt-3', name: 'Shoes', category: 'cat-7', defaultGroups: ['General', 'Material', 'Sizing'], status: 'Active' },
];

const mockCategories = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Mobiles' },
  { id: 'cat-6', name: 'Fashion' },
  { id: 'cat-7', name: 'Shoes' },
];

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState(initialProductTypes);
  
  const [newName, setNewName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [defaultGroups, setDefaultGroups] = useState('');
  const [status, setStatus] = useState('Active');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim() || !selectedCategory) {
      toast.error('Name and Category are required');
      return;
    }

    const groupsArray = defaultGroups.split(',').map(g => g.trim()).filter(g => g);
    
    const newPt = {
      id: `pt-${Date.now()}`,
      name: newName,
      category: selectedCategory,
      defaultGroups: groupsArray.length > 0 ? groupsArray : ['General'],
      status
    };

    setProductTypes(prev => [...prev, newPt]);
    setNewName('');
    setSelectedCategory('');
    setDefaultGroups('');
    setStatus('Active');
    toast.success('Product Type created successfully!');
  };

  const handleDelete = (id) => {
    setProductTypes(prev => prev.filter(pt => pt.id !== id));
    toast.success('Product Type removed');
  };

  const getCategoryName = (id) => {
    return mockCategories.find(c => c.id === id)?.name || 'Unknown';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Product Types List */}
      <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
        <div>
          <h2 className="text-lg font-black text-gray-900">Product Types Manager</h2>
          <p className="text-xs text-gray-500 mt-1">Define families of products and their default attribute groups.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Type Name</th>
                <th className="px-4 py-3">Category Map</th>
                <th className="px-4 py-3">Attribute Groups</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productTypes.map(pt => (
                <tr key={pt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
                      <FiTag />
                    </div>
                    {pt.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-[10px] font-semibold">
                      {getCategoryName(pt.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {pt.defaultGroups.map(g => (
                        <span key={g} className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {pt.status === 'Active' ? (
                      <span className="text-green-600 flex items-center gap-1 font-bold text-[10px]"><FiCheck /> Active</span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1 font-bold text-[10px]"><FiX /> Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(pt.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productTypes.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-xs">No Product Types found. Create one!</div>
          )}
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit sticky top-6">
        <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
          <FiPlus className="text-[#ff6a00]" /> Add Product Type
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Type Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
              placeholder="e.g. Mobile"
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Map to Category</label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium bg-white"
            >
              <option value="">-- Select Category --</option>
              {mockCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Default Groups (Comma separated)</label>
            <textarea
              value={defaultGroups}
              onChange={(e) => setDefaultGroups(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
              placeholder="General, Specifications, Dimensions..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <FiPlus />
              Create Product Type
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ProductTypes;
