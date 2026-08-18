import { useState } from 'react';
import { FiPlus, FiTag, FiTrash2, FiEdit2, FiImage, FiCheckCircle, FiStar, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialBrands = [
  { id: 'br-1', name: 'Apple', slug: 'apple', country: 'USA', official: true, featured: true, status: 'Active', productCount: 45 },
  { id: 'br-2', name: 'Sony', slug: 'sony', country: 'Japan', official: true, featured: false, status: 'Active', productCount: 22 },
  { id: 'br-3', name: 'VertexGears', slug: 'vertexgears', country: 'Local', official: false, featured: true, status: 'Active', productCount: 12 }
];

const Brands = () => {
  const [brands, setBrands] = useState(initialBrands);

  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('Active');
  const [official, setOfficial] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBr = {
      id: `br-${Date.now()}`,
      name, slug, description, country, official, featured, status,
      productCount: 0
    };

    setBrands(prev => [...prev, newBr]);
    
    setName(''); setSlug(''); setDescription(''); setCountry(''); setStatus('Active');
    setOfficial(false); setFeatured(false); setMetaTitle(''); setMetaDesc('');
    
    toast.success('Brand created successfully!');
  };

  const handleDelete = (id) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    toast.success('Brand removed');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black text-gray-900">Brand Manager</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Manage marketplace brands, official store badges, and SEO metadata. Brands help customers filter and discover trusted products easily.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Brands Table List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Brand Info</th>
                  <th className="px-4 py-3">Origin</th>
                  <th className="px-4 py-3">Badges</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {brands.map((br) => (
                  <tr key={br.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center border border-gray-200" title="Logo Placeholder">
                          <FiImage size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-950 text-[13px]">{br.name}</p>
                          <p className="text-[10px] text-gray-400">/{br.slug} • {br.productCount} Products</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 font-medium">
                        <FiGlobe className="text-gray-400" /> {br.country || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {br.official && <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded w-fit border border-blue-100 flex items-center gap-1"><FiCheckCircle /> Official Store</span>}
                        {br.featured && <span className="text-[9px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded w-fit border border-orange-100 flex items-center gap-1"><FiStar className="fill-orange-500" /> Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${br.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {br.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(br.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
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

        {/* Add form */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 h-fit sticky top-6">
          <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
            <FiPlus className="text-[#ff6a00]" /> Add New Brand
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Brand Name</label>
                <input
                  type="text" required value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Slug</label>
                <input
                  type="text" required value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-xs bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs" rows={2}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Country</label>
                <input
                  type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs"
                  placeholder="e.g. USA, Japan"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-100">
                <input type="checkbox" checked={official} onChange={(e) => setOfficial(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                <span className="text-[11px] font-bold text-gray-700">Official Store</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-100">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded text-[#ff6a00] focus:ring-[#ff6a00]" />
                <span className="text-[11px] font-bold text-gray-700">Featured Brand</span>
              </label>
            </div>

            <div className="pt-2 border-t border-gray-50 space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SEO Information</p>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Meta Title</label>
                <input
                  type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Meta Description</label>
                <textarea
                  value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-xs" rows={2}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <FiPlus size={16} /> Create Brand
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Brands;
