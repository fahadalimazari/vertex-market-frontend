import { useState, useEffect } from 'react';
import { FiGlobe, FiSave, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const SellerSEO = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [seo, setSeo] = useState({
    storeSeoTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });
  const [storeName, setStoreName] = useState('Your Store Name'); // For live preview

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/v1/seller/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const seller = res.data.data;
          setStoreName(seller.storeName || 'Your Store Name');
          setSeo({
            storeSeoTitle: seller.storeSeoTitle || '',
            metaDescription: seller.metaDescription || '',
            metaKeywords: seller.metaKeywords || ''
          });
        }
      } catch (error) {
        console.error('Failed to load SEO:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:5000/api/v1/seller/seo', seo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Store SEO updated successfully!');
    } catch (error) {
      toast.error('Failed to update SEO.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6 text-center text-gray-500">Loading SEO settings...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiGlobe className="text-[#ff6a00]" /> Store SEO
          </h1>
          <p className="text-sm text-gray-500 mt-1">Optimize how your store appears in Google search results.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-1 sm:p-2 transition-colors disabled:opacity-70"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave />}
          {loading ? 'Saving...' : 'Save SEO'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">SEO Title</label>
              <input 
                type="text"
                value={seo.storeSeoTitle}
                onChange={(e) => setSeo({ ...seo, storeSeoTitle: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 outline-none w-full focus:border-[#ff6a00]"
                placeholder="e.g. Official Electronics Store | Vertex Market"
              />
              <p className="text-[10px] text-gray-500 text-right">{seo.storeSeoTitle.length} / 60 characters recommended</p>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Meta Description</label>
              <textarea 
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 outline-none w-full min-h-[100px] focus:border-[#ff6a00]" 
                placeholder="Write a compelling description to get more clicks..."
              ></textarea>
              <p className="text-[10px] text-gray-500 text-right">{seo.metaDescription.length} / 160 characters recommended</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Meta Keywords</label>
              <input 
                type="text"
                value={seo.metaKeywords}
                onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 outline-none w-full focus:border-[#ff6a00]"
                placeholder="e.g. electronics, cheap laptops, fast delivery"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
            <FiGlobe className="text-blue-500" /> Live Google Preview
          </h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-sans">
            <div className="text-xs text-gray-500 mb-1">https://vertexmarket.com/store/{storeName.toLowerCase().replace(/\s+/g, '-')}</div>
            <div className="text-lg text-blue-700 hover:underline cursor-pointer mb-1 line-clamp-1">
              {seo.storeSeoTitle || `${storeName} | Vertex Market`}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2">
              {seo.metaDescription || "Explore the best deals and latest products from our store on Vertex Market."}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg flex gap-2">
            <FiInfo className="shrink-0 mt-0.5" />
            <p>Good SEO helps customers find your store organically via search engines.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerSEO;
