import { useState } from 'react';
import { FiPlus, FiSettings, FiTrash2, FiEdit2, FiCheck, FiX, FiFilter, FiBarChart2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialAttributes = [
  { 
    id: 'attr-1', name: 'RAM', slug: 'ram', type: 'Dropdown', required: true, filterable: true, comparable: true, searchable: true, 
    visibleOnCard: true, visibleOnPDP: true, unit: 'GB', status: 'Active', options: '4, 8, 12, 16'
  },
  { 
    id: 'attr-2', name: 'Storage', slug: 'storage', type: 'Dropdown', required: true, filterable: true, comparable: true, searchable: true, 
    visibleOnCard: true, visibleOnPDP: true, unit: 'GB', status: 'Active', options: '64, 128, 256, 512, 1024'
  },
  { 
    id: 'attr-3', name: 'Waterproof', slug: 'waterproof', type: 'Boolean', required: false, filterable: true, comparable: true, searchable: false, 
    visibleOnCard: false, visibleOnPDP: true, unit: '', status: 'Active', options: ''
  }
];

const fieldTypes = ['Text', 'Number', 'Dropdown', 'Checkbox', 'Radio', 'Multi Select', 'Color Picker', 'Image Picker', 'Date', 'Boolean', 'URL', 'File Upload'];

const AttributesBuilder = () => {
  const [attributes, setAttributes] = useState(initialAttributes);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Text');
  const [options, setOptions] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState('Active');
  
  // Booleans
  const [req, setReq] = useState(false);
  const [filterable, setFilterable] = useState(true);
  const [comparable, setComparable] = useState(true);
  const [searchable, setSearchable] = useState(false);
  const [visCard, setVisCard] = useState(false);
  const [visPDP, setVisPDP] = useState(true);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const newAttr = {
      id: `attr-${Date.now()}`,
      name, slug, type, options, unit, status,
      required: req, filterable, comparable, searchable,
      visibleOnCard: visCard, visibleOnPDP: visPDP
    };

    setAttributes(prev => [...prev, newAttr]);
    
    // Reset
    setName(''); setSlug(''); setType('Text'); setOptions(''); setUnit(''); 
    setReq(false); setFilterable(true); setComparable(true); setSearchable(false);
    setVisCard(false); setVisPDP(true);
    
    toast.success('Attribute created successfully!');
  };

  const handleDelete = (id) => {
    setAttributes(prev => prev.filter(a => a.id !== id));
    toast.success('Attribute removed');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black text-gray-900">Dynamic Attribute Builder</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Build the core specification engine. Instead of hardcoding product specifications, create them dynamically here. 
          Configure whether an attribute acts as a filter, appears on the comparison page, or is required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attributes List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Available Attributes</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Attribute</th>
                  <th className="px-4 py-3">Type / Unit</th>
                  <th className="px-4 py-3">Behaviors</th>
                  <th className="px-4 py-3">Visibility</th>
                  <th className="px-4 py-3 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attributes.map(attr => (
                  <tr key={attr.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{attr.name}</p>
                      <p className="text-[10px] text-gray-400">/{attr.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">
                        {attr.type}
                      </span>
                      {attr.unit && <span className="ml-1 text-gray-400 text-[10px]">({attr.unit})</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {attr.filterable && <span title="Filterable" className="text-orange-500"><FiFilter size={14} /></span>}
                        {attr.comparable && <span title="Comparable" className="text-purple-500"><FiBarChart2 size={14} /></span>}
                        {attr.searchable && <span title="Searchable" className="text-green-500"><FiSearch size={14} /></span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-[9px] font-bold uppercase text-gray-500">
                        {attr.visibleOnCard && <span className="text-green-600">✓ Card</span>}
                        {attr.visibleOnPDP && <span className="text-green-600">✓ Details Page</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(attr.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit sticky top-6">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            <FiSettings className="text-[#ff6a00]" /> Create New Attribute
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Name</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                  placeholder="e.g. RAM"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Slug</label>
                <input
                  type="text" required value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-xs bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Field Type</label>
                <select
                  value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white"
                >
                  {fieldTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Unit (Optional)</label>
                <input
                  type="text" value={unit} onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                  placeholder="e.g. GB, kg"
                />
              </div>
            </div>

            {['Dropdown', 'Radio', 'Multi Select'].includes(type) && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Options (Comma separated)</label>
                <textarea
                  value={options} onChange={(e) => setOptions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                  placeholder="4, 8, 16, 32" rows={2}
                />
              </div>
            )}

            <div className="pt-2 border-t border-gray-50">
              <p className="text-[11px] font-bold text-gray-700 uppercase mb-3">Behaviors & Visibility</p>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={req} onChange={(e) => setReq(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                  <span className="text-xs font-semibold text-gray-700">Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterable} onChange={(e) => setFilterable(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                  <span className="text-xs font-semibold text-gray-700">Filterable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={comparable} onChange={(e) => setComparable(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                  <span className="text-xs font-semibold text-gray-700">Comparable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={searchable} onChange={(e) => setSearchable(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                  <span className="text-xs font-semibold text-gray-700">Searchable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visCard} onChange={(e) => setVisCard(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                  <span className="text-xs font-semibold text-gray-700">Show on Card</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={visPDP} onChange={(e) => setVisPDP(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                  <span className="text-xs font-semibold text-gray-700">Show on PDP</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <FiPlus />
                Save Attribute
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AttributesBuilder;
